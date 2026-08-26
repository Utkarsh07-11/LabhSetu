import { NextResponse } from "next/server";
import {
  createAdminSession,
  setAdminSessionCookie,
  verifyAdminCredentials
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const valid = await verifyAdminCredentials(username, password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    const token = await createAdminSession(username);
    await setAdminSessionCookie(token);

    return NextResponse.json({
      ok: true,
      token,
      expiresInSeconds: 60 * 60 * 24
    });
  } catch (error) {
    console.error("admin login error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to login." },
      { status: 500 }
    );
  }
}
