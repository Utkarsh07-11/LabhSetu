import { NextResponse } from "next/server";
import { requireCurrentUserRecord, sanitizeUser } from "@/lib/auth";
import { listSchemes } from "@/lib/schemes-store";
import { matchSchemesLocally } from "@/lib/match-schemes";
import { updateUserProfile } from "@/lib/users";
import type { UserProfile } from "@/types";

export async function GET() {
  try {
    const user = await requireCurrentUserRecord();
    const schemes = user.profile ? matchSchemesLocally(user.profile, await listSchemes()) : [];

    return NextResponse.json({
      user: sanitizeUser(user),
      profile: user.profile ?? null,
      notificationsEnabled: user.notificationsEnabled ?? true,
      matchedSchemes: schemes
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUserRecord();
    const {
      fullName,
      phone,
      profile,
      notificationsEnabled
    }: {
      fullName: string;
      phone: string;
      profile: UserProfile;
      notificationsEnabled: boolean;
    } = await request.json();

    await updateUserProfile(user.id, {
      fullName,
      phone,
      profile,
      notificationsEnabled
    });

    const schemes = matchSchemesLocally(profile, await listSchemes());
    return NextResponse.json({
      ok: true,
      matchedSchemes: schemes
    });
  } catch (error) {
    console.error("profile save error", error);
    return NextResponse.json({ error: "Unable to save profile." }, { status: 500 });
  }
}
