import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic auth routing (Next.js 16 `proxy`, formerly `middleware`).
 *
 * Runs on the Node.js runtime. It only checks for the *presence* of the session
 * cookie — a cheap, optimistic check — and bounces already-signed-in users away
 * from the auth pages. The real authorization always happens closer to the data
 * (the DAL / Server Actions), never here.
 */

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "memories_session";
const AUTH_PAGES = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(COOKIE_NAME)?.value);
  const { pathname } = request.nextUrl;

  if (hasSession && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup"],
};
