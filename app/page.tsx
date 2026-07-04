import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/dal";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-indigo-600">
          Memories
        </h1>
        <p className="mt-2 text-slate-500">Share and relive your moments.</p>
      </div>

      {user ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-slate-700">
            Signed in as{" "}
            <span className="font-semibold text-slate-900">{user.name}</span>
            <br />
            <span className="text-sm text-slate-500">{user.email}</span>
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Log out
            </button>
          </form>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Sign up
          </Link>
        </div>
      )}
    </main>
  );
}
