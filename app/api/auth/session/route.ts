import { NextResponse } from "next/server";
import { getCurrentUserRecord, sanitizeUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUserRecord();
  return NextResponse.json({ user: user ? sanitizeUser(user) : null });
}
