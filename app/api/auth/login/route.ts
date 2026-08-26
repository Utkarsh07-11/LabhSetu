import { NextResponse } from "next/server";
import {
  createSession,
  sanitizeUser,
  setSessionCookie,
  verifyPassword
} from "@/lib/auth";
import { findUserByEmail, updateUserLogin } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    await updateUserLogin(user.id);
    const session = await createSession(user.id);
    await setSessionCookie(session);

    return NextResponse.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("login error", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
