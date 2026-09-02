import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "kabero_admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days, in seconds

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  adminId: string;
  username: string;
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// Full verification (signature + expiry) — safe to use anywhere, including
// inside Server Actions. Every admin mutation must call this itself; the
// proxy-level check (see proxy.ts) is only a cheap optimistic redirect and is
// explicitly documented by Next.js as insufficient on its own.
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return { adminId: payload.adminId as string, username: payload.username as string };
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
