import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";
import { getMongoDb } from "@/lib/mongodb";
import { portalRegistry } from "@/lib/portal-registry";
import { schemeCatalog } from "@/lib/schemes-data";
import { slugify } from "@/lib/utils";
import type { Scheme, SchemeCategory } from "@/types";

const parser = new XMLParser({
  ignoreAttributes: false
});
const DAY_IN_MS = 24 * 60 * 60 * 1000;
let runningSyncPromise: Promise<
  { schemeCount: number; sourceCount: number } | null
> | null = null;

const mySchemePages = [
  "https://www.myscheme.gov.in/search",
  "https://www.myscheme.gov.in/search/state/all-states",
  "https://www.myscheme.gov.in/search/ministry/all-ministries",
  "https://www.myscheme.gov.in/find-scheme",
  "https://www.myscheme.gov.in/find-scheme/scheme-category"
];

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "LabhSetuBot/1.0 (+local-dev)"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`);
  }

  return response.text();
}

function extractMeta(html: string, url: string) {
  const $ = cheerio.load(html);
  const title =
    $("meta[property='og:title']").attr("content") ||
    $("title").first().text().trim() ||
    $("h1").first().text().trim();
  const description =
    $("meta[name='description']").attr("content") ||
    $("meta[property='og:description']").attr("content") ||
    $("p").first().text().trim();

  return {
    url,
    title: title || url,
    description: description || null
  };
}

function getPortalMinistry(level: "Central" | "State", state?: string) {
  return level === "Central"
    ? "Government of India"
    : `Government of ${state ?? "State"}`;
}

function getPortalBenefit(description: string | null, name: string) {
  if (description) {
    return description;
  }

  return `${name} is an official government portal that helps citizens discover services, schemes, and application pathways.`;
}

function mapPortalCategory(category: string): SchemeCategory {
  switch (category) {
    case "Scholarship":
      return "Education";
    case "Health":
      return "Health";
    case "Housing":
      return "Housing";
    case "Agriculture":
      return "Agriculture";
    case "Finance":
      return "Financial";
    case "Welfare":
      return "Other";
    case "Scheme Directory":
    case "Service Portal":
    default:
      return "Other";
  }
}

async function fetchSitemapUrls() {
  const indexXml = await fetchText("https://www.myscheme.gov.in/sitemap.xml");
  const index = parser.parse(indexXml) as {
    sitemapindex?: { sitemap?: Array<{ loc: string }> | { loc: string } };
  };

  const rawSitemaps = index.sitemapindex?.sitemap;
  const sitemapUrls = Array.isArray(rawSitemaps)
    ? rawSitemaps.map((item) => item.loc)
    : rawSitemaps
      ? [rawSitemaps.loc]
      : [];

  const pageUrls = new Set<string>(mySchemePages);

  for (const sitemapUrl of sitemapUrls) {
    const xml = await fetchText(sitemapUrl);
    const sitemap = parser.parse(xml) as {
      urlset?: { url?: Array<{ loc: string }> | { loc: string } };
    };

    const rawUrls = sitemap.urlset?.url;
    const urls = Array.isArray(rawUrls)
      ? rawUrls.map((item) => item.loc)
      : rawUrls
        ? [rawUrls.loc]
        : [];

    for (const url of urls) {
      if (
        url.includes("/search") ||
        url.includes("/find-scheme") ||
        url.includes("/external/search")
      ) {
        pageUrls.add(url);
      }
    }
  }

  return [...pageUrls];
}

async function buildMySchemeSourceSnapshots() {
  const urls = await fetchSitemapUrls();
  const snapshots = [];

  for (const url of urls) {
    try {
      const html = await fetchText(url);
      snapshots.push({
        source: "myscheme",
        kind: "page",
        ...extractMeta(html, url),
        fetchedAt: new Date().toISOString()
      });
    } catch (error) {
      snapshots.push({
        source: "myscheme",
        kind: "page",
        url,
        title: url,
        description:
          error instanceof Error ? error.message : "Unable to fetch page",
        fetchedAt: new Date().toISOString()
      });
    }
  }

  return snapshots;
}

async function buildPortalRegistrySnapshots() {
  const snapshots = [];

  for (const portal of portalRegistry) {
    try {
      const html = await fetchText(portal.url);
      snapshots.push({
        ...portal,
        kind: "portal",
        ...extractMeta(html, portal.url),
        fetchedAt: new Date().toISOString()
      });
    } catch (error) {
      snapshots.push({
        ...portal,
        kind: "portal",
        title: portal.name,
        description:
          error instanceof Error ? error.message : "Unable to fetch portal",
        fetchedAt: new Date().toISOString()
      });
    }
  }

  return snapshots;
}

function buildPortalSchemeRecords(
  snapshots: Array<
    {
      id: string;
      name: string;
      level: "Central" | "State";
      state?: string;
      category: string;
      url: string;
      notes?: string;
      title: string;
      description: string | null;
    }
  >
): Scheme[] {
  return snapshots.map((snapshot) => ({
    id: snapshot.id,
    slug: slugify(snapshot.id),
    name: snapshot.title || snapshot.name,
    ministry: getPortalMinistry(snapshot.level, snapshot.state),
    type: snapshot.level,
    state: snapshot.state ?? null,
    category: mapPortalCategory(snapshot.category),
    benefit: getPortalBenefit(snapshot.description, snapshot.name),
    annualBenefit: null,
    howToApply: `Visit the official portal and follow the citizen service or scheme application flow published there.`,
    documents: [],
    applyUrl: snapshot.url,
    deadline: "Varies by scheme",
    overview: snapshot.notes || snapshot.description || snapshot.name,
    eligibility: [],
    tags: ["Official Portal", snapshot.category, snapshot.level],
    sourceUrl: snapshot.url,
    sourceLabel: "Official Portal",
    ingestionSource: "portal-registry",
    lastSyncedAt: new Date().toISOString()
  }));
}

async function buildSchemeRecords() {
  const items: Scheme[] = [];

  for (const scheme of schemeCatalog) {
    const url = scheme.applyUrl || scheme.sourceUrl;
    let liveMeta: { title?: string; description?: string | null } | null = null;

    if (url) {
      try {
        const html = await fetchText(url);
        liveMeta = extractMeta(html, url);
      } catch {
        liveMeta = null;
      }
    }

    items.push({
      ...scheme,
      sourceUrl: url ?? null,
      sourceLabel: url?.includes("myscheme.gov.in")
        ? "myScheme"
        : url
          ? "Official Portal"
          : null,
      ingestionSource: url?.includes("myscheme.gov.in")
        ? "myscheme-portal"
        : "official-portal",
      overview: liveMeta?.description || scheme.overview || scheme.benefit,
      lastSyncedAt: new Date().toISOString()
    });
  }

  return items;
}

export async function syncSchemesFromInternet() {
  const db = await getMongoDb();
  if (!db) {
    throw new Error("MongoDB is not configured. Set MONGODB_URI first.");
  }

  const schemes = await buildSchemeRecords();
  const [mySchemeSnapshots, registrySnapshots] = await Promise.all([
    buildMySchemeSourceSnapshots(),
    buildPortalRegistrySnapshots()
  ]);
  const sourceSnapshots = [...mySchemeSnapshots, ...registrySnapshots];
  const portalSchemes = buildPortalSchemeRecords(registrySnapshots);
  const allSchemes = [...schemes, ...portalSchemes];

  await db.collection("schemes").createIndex({ slug: 1 }, { unique: true });
  await db.collection("saved_results").createIndex({ share_id: 1 }, { unique: true });
  await db.collection("scheme_sources").createIndex(
    { url: 1, source: 1 },
    { unique: true }
  );

  for (const scheme of allSchemes) {
    await db.collection("schemes").updateOne(
      { slug: scheme.slug },
      {
        $set: scheme,
        $setOnInsert: {
          createdAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );
  }

  for (const source of sourceSnapshots) {
    await db.collection("scheme_sources").updateOne(
      { url: source.url, source: source.source },
      {
        $set: source,
        $setOnInsert: {
          id: slugify(source.url)
        }
      },
      { upsert: true }
    );
  }

  await db.collection("sync_runs").insertOne({
    kind: "scheme-sync",
    sourceCount: sourceSnapshots.length,
    schemeCount: allSchemes.length,
    finishedAt: new Date().toISOString()
  });

  return {
    schemeCount: allSchemes.length,
    sourceCount: sourceSnapshots.length
  };
}

export async function ensureDailySchemeSync() {
  const db = await getMongoDb();
  if (!db) {
    return null;
  }

  const lastRun = await db
    .collection("sync_runs")
    .find({ kind: "scheme-sync" })
    .sort({ finishedAt: -1 })
    .limit(1)
    .next();

  const lastFinishedAt = lastRun?.finishedAt
    ? new Date(String(lastRun.finishedAt)).getTime()
    : 0;
  const shouldSync = !lastFinishedAt || Date.now() - lastFinishedAt >= DAY_IN_MS;

  if (!shouldSync) {
    return null;
  }

  if (!runningSyncPromise) {
    runningSyncPromise = syncSchemesFromInternet().finally(() => {
      runningSyncPromise = null;
    });
  }

  return runningSyncPromise;
}
