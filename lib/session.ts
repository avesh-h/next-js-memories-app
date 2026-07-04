import "server-only";

import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  SESSION_FALLBACK_MAX_AGE_SECONDS,
} from "@/lib/config";
import type { Session } from "@/lib/types";

/**
 * Stateless session management.
 *
 * We store the backend-issued JWT (the credential used to call the
 * microservices) plus a minimal, non-sensitive profile in a single httpOnly
 * cookie. httpOnly means client JS can never read it — Server Components,
 * Server Actions and Route Handlers read it via {@link getSession} and pass
 * only what the UI needs down to Client Components.
 *
 * The backend already signs and (on each request) verifies the JWT, so we keep
 * this layer thin: we decode the token's `exp` claim only to align the cookie's
 * lifetime with the token's, and never trust it for authorization.
 */

/** Decode a JWT payload without verifying the signature. Returns null if malformed. */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Seconds until the token expires, or a safe fallback when there's no `exp`. */
function maxAgeFromToken(token: string): number {
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;
  if (typeof exp === "number") {
    const seconds = exp - Math.floor(Date.now() / 1000);
    if (seconds > 0) return seconds;
  }
  return SESSION_FALLBACK_MAX_AGE_SECONDS;
}

/** Persist a new session in an httpOnly cookie. Call only from Server Actions / Route Handlers. */
export async function createSession(session: Session): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeFromToken(session.token),
  });
}

/** Read and parse the current session, or null if absent/expired/corrupt. */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as Session;
    if (!session?.token || !session?.user?.id) return null;
    return session;
  } catch {
    return null;
  }
}

/** Delete the session cookie (logout). */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
