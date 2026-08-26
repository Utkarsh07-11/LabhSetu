import { NextRequest, NextResponse } from "next/server";
import { ensureDailyEligibilityDigest } from "@/lib/eligibility-digest";
import { ensureDailySchemeSync } from "@/lib/scheme-sync";
import { listSchemes } from "@/lib/schemes-store";

export async function GET(request: NextRequest) {
  void ensureDailySchemeSync().catch((error) => {
    console.error("daily scheme sync failed", error);
  });
  void ensureDailyEligibilityDigest().catch((error) => {
    console.error("daily eligibility digest failed", error);
  });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const state = searchParams.get("state");
  const query = searchParams.get("q")?.toLowerCase();

  const storedSchemes = await listSchemes();
  const schemes = storedSchemes.filter((scheme) => {
    const matchesType = type ? scheme.type === type : true;
    const matchesCategory = category ? scheme.category === category : true;
    const matchesState = state
      ? scheme.type === "Central" || scheme.state === state
      : true;
    const matchesQuery = query
      ? `${scheme.name} ${scheme.ministry} ${scheme.category}`
          .toLowerCase()
          .includes(query)
      : true;

    return matchesType && matchesCategory && matchesState && matchesQuery;
  });

  return NextResponse.json({
    schemes,
    total: schemes.length,
    page: 1,
    totalPages: 1
  });
}
