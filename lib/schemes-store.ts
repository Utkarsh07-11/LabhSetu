import { buildDefaultCatalog } from "@/lib/catalog-builder";
import { getMongoDb } from "@/lib/mongodb";
import { getSchemeBySlug } from "@/lib/schemes-data";
import type { Scheme } from "@/types";

function toPlainValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeSchemeDocument(document: Record<string, unknown>): Scheme {
  const plain = toPlainValue(document) as Record<string, unknown>;
  delete plain._id;

  return plain as unknown as Scheme;
}

export async function listSchemes() {
  const defaultCatalog = buildDefaultCatalog();
  const db = await getMongoDb();

  if (!db) {
    return defaultCatalog;
  }

  const items = (await db
    .collection("schemes")
    .find({})
    .sort({ type: 1, name: 1 })
    .toArray()) as unknown as Record<string, unknown>[];

  const merged = new Map<string, Scheme>();

  for (const scheme of defaultCatalog) {
    merged.set(scheme.slug, scheme);
  }

  for (const scheme of items.map(normalizeSchemeDocument)) {
    merged.set(scheme.slug, scheme);
  }

  return [...merged.values()];
}

export async function findSchemeBySlug(slug: string) {
  const defaultCatalog = buildDefaultCatalog();
  const db = await getMongoDb();

  if (!db) {
    return defaultCatalog.find((scheme) => scheme.slug === slug || scheme.id === slug) ?? null;
  }

  const item = (await db.collection("schemes").findOne({
    $or: [{ slug }, { id: slug }]
  })) as unknown as Record<string, unknown> | null;

  return (
    (item ? normalizeSchemeDocument(item) : null) ??
    defaultCatalog.find((scheme) => scheme.slug === slug || scheme.id === slug) ??
    getSchemeBySlug(slug) ??
    null
  );
}

export async function getSchemeSlugs() {
  const schemes = await listSchemes();
  return schemes.map((scheme) => scheme.slug);
}
