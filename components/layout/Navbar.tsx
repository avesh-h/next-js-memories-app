import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/dal";

/**
 * Auth-aware navigation bar.
 *
 * This is a Server Component: it reads the current user on the server via the
 * DAL and renders accordingly. Nothing here ships to the browser except the
 * final HTML — the token and session logic stay server-side. The "Log out"
 * button posts to the `logout` Server Action.
 */
export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/posts"
          className="text-lg font-bold tracking-tight text-indigo-600"
        >
          Memories
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link
                href="/posts/new"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white transition hover:bg-indigo-500"
              >
                New post
              </Link>
              <span className="hidden text-slate-600 sm:inline">
                {user.name}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white transition hover:bg-indigo-500"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
