import Link from "next/link";
import { getPostsByTags } from "@/lib/posts/queries";

/**
 * "You might also like" — fetches posts sharing the current post's tags.
 *
 * This is deliberately its own async Server Component so the detail page can
 * wrap it in <Suspense>: the main post renders immediately while this slower,
 * secondary query streams in. That avoids a waterfall where recommendations
 * block the whole page.
 */
export async function RecommendedPosts({
  tags,
  excludeId,
}: {
  tags: string[];
  excludeId: string;
}) {
  const posts = (await getPostsByTags(tags))
    .filter((p) => p._id !== excludeId)
    .slice(0, 4);

  if (!posts.length) {
    return <p className="text-sm text-slate-500">No suggestions yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {posts.map((post) => (
        <Link
          key={post._id}
          href={`/posts/${post._id}`}
          className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:shadow-md"
        >
          {post.selectedFile ? (
            // eslint-disable-next-line @next/next/no-img-element -- base64 data URL
            <img
              src={post.selectedFile}
              alt={post.title}
              className="h-24 w-full object-cover"
            />
          ) : (
            <div className="h-24 w-full bg-slate-100" />
          )}
          <div className="p-2">
            <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
              {post.title}
            </p>
            <p className="text-xs text-slate-400">{post.likes.length} likes</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
