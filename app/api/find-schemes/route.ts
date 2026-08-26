import { NextRequest, NextResponse } from "next/server";
import { ensureDailyEligibilityDigest } from "@/lib/eligibility-digest";
import { findSchemesWithAI } from "@/lib/openrouter";
import { ensureDailySchemeSync } from "@/lib/scheme-sync";
import { listSchemes } from "@/lib/schemes-store";
import type { UserProfile } from "@/types";

function validateProfile(profile: UserProfile) {
  return (
    Boolean(profile.age) &&
    Boolean(profile.gender) &&
    Boolean(profile.state) &&
    Boolean(profile.income) &&
    Boolean(profile.occupation) &&
    Boolean(profile.category)
  );
}

export async function POST(request: NextRequest) {
  try {
    void ensureDailySchemeSync().catch((error) => {
      console.error("daily scheme sync failed", error);
    });
    void ensureDailyEligibilityDigest().catch((error) => {
      console.error("daily eligibility digest failed", error);
    });

    const body = (await request.json()) as UserProfile;

    if (!validateProfile(body)) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const schemes = await listSchemes();
    const result = await findSchemesWithAI(body, schemes);
    return NextResponse.json({
      schemes: result.schemes,
      count: result.schemes.length,
      source: result.source
    });
  } catch (error) {
    console.error("find-schemes error", error);
    return NextResponse.json(
      { error: "Failed to fetch schemes. Please try again." },
      { status: 500 }
    );
  }
}
