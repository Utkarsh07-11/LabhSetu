import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/auth";
import { runDailyEligibilityDigest } from "@/lib/eligibility-digest";

export async function POST(request: Request) {
  const authorized = await isAuthorizedAdminRequest(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDailyEligibilityDigest();
    return NextResponse.json(result);
  } catch (error) {
    console.error("daily-match error", error);
    return NextResponse.json({ error: "Unable to run daily match." }, { status: 500 });
  }
}
