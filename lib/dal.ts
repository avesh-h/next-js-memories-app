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
