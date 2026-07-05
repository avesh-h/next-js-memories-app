import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import type { SessionUser } from "@/lib/types";

/**
 * Data Access Layer.
 *
 * Centralizes "who is the current user?" so every Server Component / Action
 * asks the same function. Wrapped in React's `cache()` so the session cookie
 * is read at most once per request render pass, even if many components call it.
 *
 * ---------------------------------------------------------------------------
 * QUICK REFERENCE: the TWO caches in this app (don't confuse them)
 * ---------------------------------------------------------------------------
 * React `cache()` (used HERE)          |  Data Cache (used in lib/posts/queries.ts)
 * -------------------------------------|-------------------------------------------
 * Wraps: non-fetch reads (cookie, DB)  |  Wraps: fetch() calls
 * Lives for: ONE request, then gone    |  Lives: ACROSS requests (persistent, on disk)
 * Stored: in memory, per-request       |  Stored: Next.js Data Cache (.next/cache)
 * Purpose: dedupe repeated calls in    |  Purpose: avoid re-fetching from the backend
 *          the same render pass         |           every time
 * Expires: never on a timer — React    |  Expires: `revalidate` seconds, OR on demand
 *          discards it when the request |           via revalidateTag(tag, 'max')
 *          ends. No manual invalidation.|
 * You manage it? No — fully internal.  |  You manage it? Yes — tags + revalidate.
 *
 * Rule of thumb:
 *   - cache()      -> "don't ask the same question twice in ONE request"
 *   - Data Cache   -> "don't re-fetch this from the backend on EVERY request"
 *   - fetch() is already auto-deduped by Next, so it doesn't need cache().
 * ---------------------------------------------------------------------------
 */

/** Returns the current user, or null when signed out. Safe to call anywhere on the server. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await getSession();
  return session?.user ?? null;
});

/** Like {@link getCurrentUser} but redirects to /login when there is no session. */
export const requireUser = cache(async (): Promise<SessionUser> => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
});
