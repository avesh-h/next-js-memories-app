import "server-only";

/**
 * Centralized server-side configuration.
 *
 * Mirrors the microservices' `src/config/serverConfig.js` convention: read
 * `process.env` in exactly one place and export typed values everywhere else.
 * Everything here is server-only — these URLs and the cookie name must never
 * reach the client bundle.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Base URLs of the four backend microservices (each already includes `/api`). */
export const SERVICES = {
  auth: required("AUTH_SERVICE_URL", process.env.AUTH_SERVICE_URL),
  post: required("POST_SERVICE_URL", process.env.POST_SERVICE_URL),
  mail: required("MAIL_SERVICE_URL", process.env.MAIL_SERVICE_URL),
  chat: required("CHAT_SERVICE_URL", process.env.CHAT_SERVICE_URL),
} as const;

export type ServiceName = keyof typeof SERVICES;

/** Name of the httpOnly cookie holding the session (token + minimal profile). */
export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? "memories_session";

/** Fallback session lifetime when the JWT has no `exp` claim (1 hour, matching the backend). */
export const SESSION_FALLBACK_MAX_AGE_SECONDS = 60 * 60;
