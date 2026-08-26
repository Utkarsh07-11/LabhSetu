import { notFound } from "next/navigation";
import { ReportActions } from "@/components/report/report-actions";
import { getMongoDb } from "@/lib/mongodb";
import { schemeCatalog } from "@/lib/schemes-data";
import { currencyTotal } from "@/lib/utils";
import type { SavedResult, Scheme, UserProfile } from "@/types";

function parseSearchData(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function toPlainValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function getSavedReport(id: string): Promise<SavedResult | null> {
  if (id === "demo") {
    return null;
  }

  const db = await getMongoDb();
  if (!db) {
    return null;
  }

  const data = await db.collection("saved_results").findOne({ share_id: id });

  if (!data) {
    return null;
  }

  const plain = toPlainValue(data) as Record<string, unknown>;

  return {
    shareId: String(plain.share_id ?? ""),
    profile: plain.profile as UserProfile,
    schemes: (plain.schemes as Scheme[]) ?? [],
    totalSchemes: Number(plain.total_schemes ?? 0),
    createdAt: String(plain.created_at ?? "")
  };
}

export default async function ReportPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ profile?: string; schemes?: string }>;
}) {
  const { id } = await params;
  const resolvedSearch = await searchParams;
  const saved = await getSavedReport(id);

  const profile =
    saved?.profile ??
    (parseSearchData(resolvedSearch.profile ?? null) as UserProfile | null);
  const schemes =
    saved?.schemes ??
    (parseSearchData(resolvedSearch.schemes ?? null) as Scheme[] | null) ??
    schemeCatalog.slice(0, 4);

  if (!profile && id !== "demo") {
    notFound();
  }

  const total = currencyTotal(schemes);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/report/${id}`;

  return (
    <main className="min-h-screen bg-stone-50 py-10">
      <div className="container-shell rounded-[32px] border border-stone-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-6 border-b border-stone-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-4xl text-stone-900">LabhSetu</p>
            <p className="mt-2 text-sm text-stone-500">
              Generated: {new Date().toLocaleDateString("en-IN", { dateStyle: "medium" })}
            </p>
            <h1 className="mt-6 font-serif text-5xl text-stone-900">
              Eligibility Report
            </h1>
            <p className="mt-3 text-sm text-stone-600">
              {profile
                ? `${profile.gender}, ${profile.age} yrs, ${profile.state}, ${profile.category}, ${profile.occupation}`
                : "Demo report"}
            </p>
          </div>
          <ReportActions shareUrl={shareUrl} />
        </div>

        <div className="mt-8 rounded-[28px] bg-saffron-50 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-saffron-600">
            Summary
          </p>
          <p className="mt-2 font-serif text-4xl text-stone-900">
            {schemes.length} schemes {total ? `· ${total}` : ""}
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {schemes.map((scheme, index) => (
            <article key={scheme.id} className="rounded-[28px] border border-stone-200 p-6">
              <p className="text-sm text-stone-500">
                {index + 1}. {scheme.type} · {scheme.category}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                {scheme.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{scheme.benefit}</p>
              <p className="mt-4 text-sm text-stone-700">
                <span className="font-medium">Documents:</span>{" "}
                {scheme.documents.join(", ")}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
