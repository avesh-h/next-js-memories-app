import Link from "next/link";

/**
 * Rendered when the detail page calls `notFound()` (post doesn't exist).
 * A `not-found.tsx` in this route segment scopes the 404 UI to /posts/[id].
 */
export default function PostNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
      <p className="text-slate-500">
        This memory may have been deleted or never existed.
      </p>
      <Link
        href="/posts"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        Back to feed
      </Link>
    </div>
  );
}
