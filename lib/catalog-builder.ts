import { portalRegistry } from "@/lib/portal-registry";
import { schemeCatalog } from "@/lib/schemes-data";
import { slugify } from "@/lib/utils";
import type { Scheme, SchemeCategory } from "@/types";

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
    default:
      return "Other";
  }
}

function getPortalMinistry(level: "Central" | "State", state?: string) {
  return level === "Central"
    ? "Government of India"
    : `Government of ${state ?? "State"}`;
}

export function buildRegistrySchemeCatalog(): Scheme[] {
  return portalRegistry.map((portal) => ({
    id: portal.id,
    slug: slugify(portal.id),
    name: portal.name,
    ministry: getPortalMinistry(portal.level, portal.state),
    type: portal.level,
    state: portal.state ?? null,
    category: mapPortalCategory(portal.category),
    benefit:
      portal.notes ||
      `${portal.name} is an official government portal for scheme discovery, service access, or applications.`,
    annualBenefit: null,
    howToApply:
      "Visit the official portal and follow the published scheme or citizen service flow.",
    documents: [],
    applyUrl: portal.url,
    deadline: "Varies by scheme",
    overview:
      portal.notes ||
      `${portal.name} is part of the official portal registry used by LabhSetu.`,
    eligibility: [],
    tags: ["Official Portal", portal.level, portal.category],
    sourceUrl: portal.url,
    sourceLabel: "Official Portal",
    ingestionSource: "portal-registry",
    lastSyncedAt: null
  }));
}

export function buildDefaultCatalog(): Scheme[] {
  const merged = [...schemeCatalog, ...buildRegistrySchemeCatalog()];
  const deduped = new Map<string, Scheme>();

  for (const scheme of merged) {
    deduped.set(scheme.slug, scheme);
  }

  return [...deduped.values()];
}
