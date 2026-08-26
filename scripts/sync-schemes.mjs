import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";

const cwd = process.cwd();
for (const file of [".env.local", ".env"]) {
  const fullPath = path.join(cwd, file);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath, override: false });
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB ?? "schemeseva";

if (!MONGODB_URI) {
  throw new Error("MongoDB is not configured. Set MONGODB_URI first.");
}

const parser = new XMLParser({ ignoreAttributes: false });

const schemeCatalog = [
  {
    id: "pm-kisan",
    slug: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    type: "Central",
    category: "Agriculture",
    benefit:
      "Provides income support to eligible farmer families in three instalments every year.",
    annualBenefit: "₹6,000/year",
    howToApply:
      "Apply on the PM-KISAN portal or through your nearest CSC with Aadhaar and land records.",
    documents: ["Aadhaar Card", "Bank Account", "Land Record"],
    applyUrl: "https://pmkisan.gov.in/",
    deadline: "Ongoing",
    overview:
      "PM Kisan is a direct benefit transfer scheme that supports small and medium farmer households.",
    eligibility: ["Farmer family", "Valid land record", "Indian resident"],
    tags: ["Farmer", "Income Support", "Direct Benefit"]
  },
  {
    id: "ayushman-bharat",
    slug: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    ministry: "Ministry of Health and Family Welfare",
    type: "Central",
    category: "Health",
    benefit:
      "Offers cashless hospitalisation cover for eligible families at empanelled hospitals.",
    annualBenefit: "₹5,00,000/year",
    howToApply:
      "Check eligibility on the PM-JAY portal and complete verification at a listed hospital or camp.",
    documents: ["Aadhaar Card", "Ration Card", "Mobile Number"],
    applyUrl: "https://pmjay.gov.in/",
    deadline: "Ongoing",
    overview:
      "A flagship health assurance scheme that reduces catastrophic healthcare costs for vulnerable families.",
    eligibility: ["Eligible household", "PM-JAY database match"],
    tags: ["Insurance", "Hospital Cover", "Family Health"]
  },
  {
    id: "pmay-urban",
    slug: "pmay-urban",
    name: "Pradhan Mantri Awas Yojana - Urban",
    ministry: "Ministry of Housing and Urban Affairs",
    type: "Central",
    category: "Housing",
    benefit:
      "Supports first-time home buyers and urban low-income households through housing assistance and interest subsidy.",
    annualBenefit: "₹2,67,000/year",
    howToApply:
      "Apply through the PMAY-U portal or your urban local body with income proof and home ownership details.",
    documents: ["Aadhaar Card", "Income Certificate", "Address Proof"],
    applyUrl: "https://pmaymis.gov.in/",
    deadline: "Ongoing",
    overview:
      "PMAY-U helps economically weaker and middle-income families access affordable urban housing.",
    eligibility: ["Urban resident", "No pucca house", "Income-based category"],
    tags: ["Housing", "Urban", "Interest Subsidy"]
  },
  {
    id: "national-scholarship-portal",
    slug: "national-scholarship-portal",
    name: "National Scholarship Portal",
    ministry: "Ministry of Electronics & IT",
    type: "Central",
    category: "Education",
    benefit:
      "Aggregates multiple scholarships for students from minority, SC, ST, OBC, and low-income backgrounds.",
    annualBenefit: "₹75,000/year",
    howToApply:
      "Register on the NSP portal, complete your profile, upload academic documents, and submit your application.",
    documents: ["Aadhaar Card", "Income Certificate", "Marksheet"],
    applyUrl: "https://scholarships.gov.in/",
    deadline: "Seasonal",
    overview:
      "A single-window platform for many central and state scholarships with streamlined application tracking.",
    eligibility: ["Student", "Eligible category", "Academic enrolment"],
    tags: ["Student", "Scholarship", "Education"]
  },
  {
    id: "maji-ladki-bahin",
    slug: "maji-ladki-bahin",
    name: "Mukhyamantri Majhi Ladki Bahin Yojana",
    ministry: "Government of Maharashtra",
    type: "State",
    state: "Maharashtra",
    category: "Women",
    benefit:
      "Provides direct monthly assistance to eligible women in Maharashtra.",
    annualBenefit: "₹18,000/year",
    howToApply:
      "Apply through the official state portal or nearby facilitation centre with domicile and bank details.",
    documents: ["Aadhaar Card", "Domicile Certificate", "Bank Passbook"],
    applyUrl: "https://ladakibahin.maharashtra.gov.in/",
    deadline: "Ongoing",
    overview:
      "A Maharashtra state support program focused on improving the financial independence of women.",
    eligibility: [
      "Woman applicant",
      "Maharashtra resident",
      "Income threshold applies"
    ],
    tags: ["Women", "Maharashtra", "Direct Benefit"]
  },
  {
    id: "mahatma-jyotiba-phule-jan-arogya",
    slug: "mahatma-jyotiba-phule-jan-arogya",
    name: "Mahatma Jyotiba Phule Jan Arogya Yojana",
    ministry: "Government of Maharashtra",
    type: "State",
    state: "Maharashtra",
    category: "Health",
    benefit:
      "Provides cashless healthcare support for eligible residents of Maharashtra.",
    annualBenefit: "₹1,50,000/year",
    howToApply:
      "Confirm eligibility at a network hospital and complete biometric verification with identity proof.",
    documents: ["Aadhaar Card", "Ration Card", "Residence Proof"],
    applyUrl: "https://www.jeevandayee.gov.in/",
    deadline: "Ongoing",
    overview:
      "A state-backed health coverage scheme for families who need affordable access to treatment.",
    eligibility: ["Maharashtra resident", "Eligible family category"],
    tags: ["Health", "Maharashtra", "Hospital Care"]
  },
  {
    id: "pm-svanidhi",
    slug: "pm-svanidhi",
    name: "PM SVANidhi",
    ministry: "Ministry of Housing and Urban Affairs",
    type: "Central",
    category: "Livelihood",
    benefit:
      "Offers working capital support to street vendors with incentives for digital repayments.",
    annualBenefit: "₹50,000/year",
    howToApply:
      "Apply with your urban local body certificate or vendor ID through the PM SVANidhi portal.",
    documents: ["Aadhaar Card", "Vendor Certificate", "Bank Account"],
    applyUrl: "https://pmsvanidhi.mohua.gov.in/",
    deadline: "Ongoing",
    overview:
      "A micro-credit scheme helping street vendors restart and expand their businesses.",
    eligibility: ["Street vendor", "Urban local body identification"],
    tags: ["Vendor", "Loan", "Livelihood"]
  },
  {
    id: "atal-pension-yojana",
    slug: "atal-pension-yojana",
    name: "Atal Pension Yojana",
    ministry: "Ministry of Finance",
    type: "Central",
    category: "Insurance",
    benefit:
      "Builds a guaranteed pension for workers in the unorganised sector through low monthly contributions.",
    annualBenefit: "₹60,000/year",
    howToApply:
      "Visit your bank or post office, choose your pension slab, and enrol with Aadhaar-linked details.",
    documents: ["Aadhaar Card", "Savings Account", "Mobile Number"],
    applyUrl: "https://enps.nsdl.com/eNPS/NationalPensionSystem.html",
    deadline: "Ongoing",
    overview:
      "A pension-focused social security scheme designed for long-term retirement stability.",
    eligibility: ["Age 18 to 40", "Savings account holder"],
    tags: ["Pension", "Unorganised Workers", "Retirement"]
  }
];

const portalRegistry = [
  {
    id: "myscheme",
    name: "myScheme",
    level: "Central",
    category: "Other",
    url: "https://www.myscheme.gov.in/",
    notes: "National platform for scheme discovery by Digital India Corporation."
  },
  {
    id: "india-gov-schemes",
    name: "India.gov.in Schemes",
    level: "Central",
    category: "Other",
    url: "https://www.india.gov.in/my-government/schemes"
  },
  {
    id: "pm-kisan-portal",
    name: "PM Kisan Portal",
    level: "Central",
    category: "Agriculture",
    url: "https://pmkisan.gov.in/"
  },
  {
    id: "pmjay-portal",
    name: "Ayushman Bharat PM-JAY",
    level: "Central",
    category: "Health",
    url: "https://pmjay.gov.in/"
  },
  {
    id: "pmay-urban-portal",
    name: "PMAY Urban Portal",
    level: "Central",
    category: "Housing",
    url: "https://pmaymis.gov.in/"
  },
  {
    id: "pm-svanidhi-portal",
    name: "PM SVANidhi",
    level: "Central",
    category: "Financial",
    url: "https://pmsvanidhi.mohua.gov.in/"
  },
  {
    id: "national-scholarship-portal",
    name: "National Scholarship Portal",
    level: "Central",
    category: "Education",
    url: "https://scholarships.gov.in/"
  },
  {
    id: "atal-pension-portal",
    name: "Atal Pension Yojana Enrollment",
    level: "Central",
    category: "Insurance",
    url: "https://enps.nsdl.com/eNPS/NationalPensionSystem.html"
  },
  {
    id: "mahadbt",
    name: "MahaDBT",
    level: "State",
    state: "Maharashtra",
    category: "Other",
    url: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "ladki-bahin",
    name: "Majhi Ladki Bahin Portal",
    level: "State",
    state: "Maharashtra",
    category: "Women",
    url: "https://ladakibahin.maharashtra.gov.in/"
  },
  {
    id: "maharashtra-health",
    name: "Mahatma Jyotiba Phule Jan Arogya Yojana",
    level: "State",
    state: "Maharashtra",
    category: "Health",
    url: "https://www.jeevandayee.gov.in/"
  },
  {
    id: "seva-sindhu",
    name: "Seva Sindhu",
    level: "State",
    state: "Karnataka",
    category: "Other",
    url: "https://sevasindhu.karnataka.gov.in/"
  },
  {
    id: "digital-gujarat",
    name: "Digital Gujarat",
    level: "State",
    state: "Gujarat",
    category: "Other",
    url: "https://www.digitalgujarat.gov.in/"
  },
  {
    id: "telangana-meeseva",
    name: "MeeSeva Telangana",
    level: "State",
    state: "Telangana",
    category: "Other",
    url: "https://www.telangana.gov.in/services/meeseva-services"
  },
  {
    id: "ap-gsws",
    name: "Grama Ward Sachivalayam",
    level: "State",
    state: "Andhra Pradesh",
    category: "Other",
    url: "https://gramawardsachivalayam.ap.gov.in/gsws/Home/Main"
  },
  {
    id: "tn-e-sevai",
    name: "Tamil Nadu e-Sevai",
    level: "State",
    state: "Tamil Nadu",
    category: "Other",
    url: "https://it.tn.gov.in/en/node/258"
  },
  {
    id: "tn-arasu-e-sevai",
    name: "Arasu e-Sevai Centres",
    level: "State",
    state: "Tamil Nadu",
    category: "Other",
    url: "https://www.it.tn.gov.in/en/node/212"
  },
  {
    id: "tn-agri-esevai",
    name: "Tamil Nadu Agri e-Sevai",
    level: "State",
    state: "Tamil Nadu",
    category: "Agriculture",
    url: "https://www.tnagrisnet.tn.gov.in/esevai/"
  },
  {
    id: "kerala-e-district",
    name: "Kerala e-District",
    level: "State",
    state: "Kerala",
    category: "Other",
    url: "https://edistrict.kerala.gov.in/"
  },
  {
    id: "rajasthan-jan-soochna",
    name: "Jan Soochna Portal",
    level: "State",
    state: "Rajasthan",
    category: "Other",
    url: "https://jansoochna.rajasthan.gov.in/"
  },
  {
    id: "rajasthan-sje",
    name: "Rajasthan Social Justice and Empowerment",
    level: "State",
    state: "Rajasthan",
    category: "Other",
    url: "https://sje.rajasthan.gov.in/"
  }
];

const mySchemePages = [
  "https://www.myscheme.gov.in/search",
  "https://www.myscheme.gov.in/search/state/all-states",
  "https://www.myscheme.gov.in/search/ministry/all-ministries",
  "https://www.myscheme.gov.in/find-scheme",
  "https://www.myscheme.gov.in/find-scheme/scheme-category"
];

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "SchemeSevaBot/1.0 (+local-dev)" },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`);
  }
  return response.text();
}

function extractMeta(html, url) {
  const $ = cheerio.load(html);
  const title =
    $("meta[property='og:title']").attr("content") ||
    $("title").first().text().trim() ||
    $("h1").first().text().trim() ||
    url;
  const description =
    $("meta[name='description']").attr("content") ||
    $("meta[property='og:description']").attr("content") ||
    $("p").first().text().trim() ||
    null;

  return { url, title, description };
}

function getPortalMinistry(level, state) {
  return level === "Central"
    ? "Government of India"
    : `Government of ${state ?? "State"}`;
}

function getPortalBenefit(description, name) {
  if (description) {
    return description;
  }

  return `${name} is an official government portal that helps citizens discover services, schemes, and application pathways.`;
}

async function fetchSitemapUrls() {
  const indexXml = await fetchText("https://www.myscheme.gov.in/sitemap.xml");
  const index = parser.parse(indexXml);
  const rawSitemaps = index?.sitemapindex?.sitemap;
  const sitemapUrls = Array.isArray(rawSitemaps)
    ? rawSitemaps.map((item) => item.loc)
    : rawSitemaps
      ? [rawSitemaps.loc]
      : [];

  const pageUrls = new Set(mySchemePages);

  for (const sitemapUrl of sitemapUrls) {
    const xml = await fetchText(sitemapUrl);
    const sitemap = parser.parse(xml);
    const rawUrls = sitemap?.urlset?.url;
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
        description: error instanceof Error ? error.message : "Unable to fetch page",
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
        source: "portal-registry",
        kind: "portal",
        ...extractMeta(html, portal.url),
        fetchedAt: new Date().toISOString()
      });
    } catch (error) {
      snapshots.push({
        ...portal,
        source: "portal-registry",
        kind: "portal",
        title: portal.name,
        description: error instanceof Error ? error.message : "Unable to fetch portal",
        fetchedAt: new Date().toISOString()
      });
    }
  }

  return snapshots;
}

function buildPortalSchemeRecords(snapshots) {
  return snapshots.map((snapshot) => ({
    id: snapshot.id,
    slug: snapshot.id,
    name: snapshot.title || snapshot.name,
    ministry: getPortalMinistry(snapshot.level, snapshot.state),
    type: snapshot.level,
    state: snapshot.state ?? null,
    category: snapshot.category,
    benefit: getPortalBenefit(snapshot.description, snapshot.name),
    annualBenefit: null,
    howToApply:
      "Visit the official portal and follow the citizen service or scheme application flow published there.",
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
  const items = [];

  for (const scheme of schemeCatalog) {
    let liveMeta = null;
    if (scheme.applyUrl) {
      try {
        const html = await fetchText(scheme.applyUrl);
        liveMeta = extractMeta(html, scheme.applyUrl);
      } catch {
        liveMeta = null;
      }
    }

    items.push({
      ...scheme,
      sourceUrl: scheme.applyUrl ?? null,
      sourceLabel: scheme.applyUrl ? "Official Portal" : null,
      ingestionSource: "official-portal",
      overview: liveMeta?.description || scheme.overview || scheme.benefit,
      lastSyncedAt: new Date().toISOString()
    });
  }

  return items;
}

async function main() {
  const client = new MongoClient(MONGODB_URI, {
    connectTimeoutMS: 3000,
    serverSelectionTimeoutMS: 3000,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await client.connect();
  const db = client.db(MONGODB_DB);

  const schemes = await buildSchemeRecords();
  const [mySchemeSnapshots, registrySnapshots] = await Promise.all([
    buildMySchemeSourceSnapshots(),
    buildPortalRegistrySnapshots()
  ]);
  const sourceSnapshots = [...mySchemeSnapshots, ...registrySnapshots];
  const allSchemes = [...schemes, ...buildPortalSchemeRecords(registrySnapshots)];

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
        $setOnInsert: { createdAt: new Date().toISOString() }
      },
      { upsert: true }
    );
  }

  for (const source of sourceSnapshots) {
    await db.collection("scheme_sources").updateOne(
      { url: source.url, source: source.source },
      {
        $set: source,
        $setOnInsert: { createdAt: new Date().toISOString() }
      },
      { upsert: true }
    );
  }

  await db.collection("sync_runs").insertOne({
    kind: "scheme-sync",
    schemeCount: allSchemes.length,
    sourceCount: sourceSnapshots.length,
    finishedAt: new Date().toISOString()
  });

  console.log(
    `Synced ${allSchemes.length} catalog records and ${sourceSnapshots.length} source pages into MongoDB.`
  );

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
