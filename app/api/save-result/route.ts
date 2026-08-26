import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getMongoDb } from "@/lib/mongodb";
import type { Scheme, UserProfile } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const {
      profile,
      schemes
    }: { profile: UserProfile; schemes: Scheme[] } = await request.json();
    const shareId = nanoid(10);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const db = await getMongoDb();

    if (db) {
      await db.collection("saved_results").insertOne({
        share_id: shareId,
        profile,
        schemes,
        total_schemes: schemes.length,
        created_at: new Date().toISOString()
      });
    }

    return NextResponse.json({
      shareId,
      shareUrl: `${appUrl}/report/${shareId}`
    });
  } catch (error) {
    console.error("save-result error", error);
    return NextResponse.json(
      { error: "Unable to save the result right now." },
      { status: 500 }
    );
  }
}
