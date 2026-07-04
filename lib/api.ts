import "server-only";

import { SERVICES, type ServiceName } from "@/lib/config";
import { getSession } from "@/lib/session";

/**
 * Server-side API layer.
 *
 * This is the single place that talks to the backend microservices — the
 * Next.js equivalent of the old CRA `src/api/index.js`, but it runs on the
 * server, so the JWT stays in an httpOnly cookie and never reaches the browser.
 *
 * Caching strategy (Next.js `fetch` extensions):
 *   - Mutations (POST/PATCH/DELETE) must never be cached → default `no-store`.
 *   - Reads opt into the Data Cache by passing `next: { tags, revalidate }`;
 *     mutations then invalidate those tags via `revalidateTag`/`updateTag`.
 * Auth calls (sign-in/up) are unauthenticated POSTs, so they set `auth: false`
 * and are never cached.
 */

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  /** Request body — serialized to JSON automatically. */
  body?: unknown;
  /** Attach the session's Bearer token. Defaults to true; set false for public endpoints. */
  auth?: boolean;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T;
}

export async function apiFetch<T = unknown>(
  service: ServiceName,
  path: string,
  options: ApiRequestOptions = {}
): Promise<ApiResult<T>> {
  const { body, auth = true, headers, cache, ...rest } = options;

  const requestHeaders = new Headers(headers);
  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (auth) {
    const session = await getSession();
    if (session?.token) {
      requestHeaders.set("Authorization", `Bearer ${session.token}`);
    }
  }

  // Only default to `no-store` when the caller hasn't chosen a cache strategy
  // (an explicit `cache` or `next` option), so read paths can still be cached.
  const hasCacheStrategy = cache !== undefined || rest.next !== undefined;

  const res = await fetch(`${SERVICES[service]}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: cache ?? (hasCacheStrategy ? undefined : "no-store"),
  });

  const text = await res.text();
  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : (null as T);
  } catch {
    data = text as unknown as T;
  }

  return { ok: res.ok, status: res.status, data };
}

/* -------------------------------------------------------------------------- */
/*  Auth & Profile service                                                    */
/* -------------------------------------------------------------------------- */

/** User object returned by the backend on successful sign-in. */
export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  isVerified?: boolean;
}

/** Shape of the sign-in response (fields present depend on success/failure). */
export interface SignInResponse {
  result?: BackendUser;
  token?: string;
  message?: string;
  status?: string;
}

/** Shape of the register response. */
export interface SignUpResponse {
  message?: string;
  status?: string;
}

export function signInRequest(body: {
  email: string;
  password?: string;
  googleId?: string;
}) {
  return apiFetch<SignInResponse>("auth", "/v1/user/signin", {
    method: "POST",
    body,
    auth: false,
  });
}

export function signUpRequest(body: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  return apiFetch<SignUpResponse>("auth", "/v1/user/register", {
    method: "POST",
    body,
    auth: false,
  });
}
