import { Suspense } from "react";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/dal";
import { PostList } from "@/components/posts/PostList";
import { PostListSkeleton } from "@/components/posts/PostListSkeleton";

export const metadata: Metadata = {
  title: "Memories · Feed",
};

/**
 * The posts feed.
 *
 * We read the current user here (to decide which posts are "yours"), then hand
 * the actual data fetch to <PostList> behind <Suspense>, so the feed streams in
 * while the shell renders immediately. `searchParams` is async in Next.js 16.
 */
export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Memories</h1>

      {/* key={currentPage} re-triggers the Suspense fallback on page change */}
      <Suspense key={currentPage} fallback={<PostListSkeleton />}>
        <PostList page={currentPage} currentUserId={user?.id ?? null} />
      </Suspense>
    </div>
  );
}
