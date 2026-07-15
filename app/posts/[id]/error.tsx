"use client";

import { useEffect } from "react";

/**
 * Error boundary for the post detail route. Must be a Client Component and
 * accept `error` + `reset`. If `getPost` throws (e.g. the backend is down),
 * this renders instead of crashing the whole page, and `reset()` retries.
 */
export default function PostDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where you'd report to Sentry/logging.
    console.error("Post detail error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">
        Something went wrong
      </h1>
      <p className="text-slate-500">
        We couldn&apos;t load this post. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        Try again
      </button>
    </div>
  );
}
