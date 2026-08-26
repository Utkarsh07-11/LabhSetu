import { NextResponse } from "next/server";
import { createSession, hashPassword, sanitizeUser, setSessionCookie } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone } = await request.json();

    if (!email || !password || !fullName || !phone) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({
      email,
      fullName,
      phone,
      passwordHash
    });

    const session = await createSession(user.id);
    await setSessionCookie(session);

    return NextResponse.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("signup error", error);
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
