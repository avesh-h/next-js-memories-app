import { getPosts } from "@/lib/posts/queries";
import { Pagination } from "@/components/ui/Pagination";
import { PostCard } from "./PostCard";

/**
 * Server Component that fetches one page of the feed and renders the grid.
 * Because it `await`s the (cached, tagged) query, wrapping it in <Suspense>
 * upstream lets the feed stream in.
 */
export async function PostList({
  page,
  currentUserId,
}: {
  page: number;
  currentUserId: string | null;
}) {
  const { data: posts, numberOfPages } = await getPosts(page);

  if (!posts.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-500">
        No memories yet. Be the first to create one.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} currentUserId={currentUserId} />
        ))}
      </div>

      {numberOfPages > 1 ? (
        <Pagination page={page} numberOfPages={numberOfPages} basePath="/posts" />
      ) : null}
    </div>
  );
}
