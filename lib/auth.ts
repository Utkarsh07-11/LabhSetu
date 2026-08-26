import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getMongoDb } from "@/lib/mongodb";
import type { AppUser, StoredUser } from "@/types";

const SESSION_COOKIE = "labhsetu_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const ADMIN_SESSION_COOKIE = "labhsetu_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

function toPlainUser(document: StoredUser | (StoredUser & { _id?: unknown })): StoredUser {
  const plain = JSON.parse(JSON.stringify(document)) as StoredUser & {
    _id?: unknown;
  };
  delete plain._id;
  return plain;
}

export function sanitizeUser(user: StoredUser): AppUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt ?? null
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getAuthSecret());
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, getAuthSecret());
  return payload as { userId?: string };
}

export async function createAdminSession(username: string) {
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_TTL_SECONDS}s`)
    .sign(getAuthSecret());
}

export async function verifyAdminSession(token: string) {
  const { payload } = await jwtVerify(token, getAuthSecret());
  return payload as { username?: string; role?: string };
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getCurrentUserRecord() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifySession(token);
    if (!payload.userId) {
      return null;
    }

    const db = await getMongoDb();
    if (!db) {
      return null;
    }

    const user = (await db
      .collection("users")
      .findOne({ id: payload.userId })) as StoredUser | null;

    return user ? toPlainUser(user) : null;
  } catch {
    return null;
  }
}

export async function requireCurrentUserRecord() {
  const user = await getCurrentUserRecord();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAdminSession(token);
    if (payload.role !== "admin" || !payload.username) {
      return null;
    }

    return { username: payload.username };
  } catch {
    return null;
  }
}

export async function requireCurrentAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

export async function isAuthorizedAdminRequest(request: Request) {
  const bearerToken = process.env.SYNC_API_TOKEN;
  const authHeader = request.headers.get("authorization");

  if (bearerToken && authHeader === `Bearer ${bearerToken}`) {
    return true;
  }

  const admin = await getCurrentAdmin();
  return Boolean(admin);
}

export async function verifyAdminCredentials(username: string, password: string) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || (!adminPasswordHash && !adminPassword)) {
    throw new Error(
      "Admin credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH."
    );
  }

  if (username !== adminUsername) {
    return false;
  }

  if (adminPasswordHash) {
    return verifyPassword(password, adminPasswordHash);
  }

  return password === adminPassword;
}
