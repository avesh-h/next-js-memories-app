import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { getPost } from "@/lib/posts/queries";
import { CommentSection } from "@/components/posts/CommentSection";
import { RecommendedPosts } from "@/components/posts/RecommendedPosts";

type PageProps = { params: Promise<{ id: string }> };

/**
 * Dynamic metadata — sets the browser tab title + description per post.
 *
 * Note: `getPost(id)` is called here AND in the page below, but Next.js
 * memoizes identical `fetch` calls within one request, so the backend is hit
 * only once. (`params` is async in Next.js 16.)
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Post not found · Memories" };

  return {
    title: `${post.title} · Memories`,
    description: post.message?.slice(0, 150),
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Parallel fetch: the post and the current user are independent, so we start
  // both at once with Promise.all instead of awaiting them one after another.
  const [post, user] = await Promise.all([getPost(id), getCurrentUser()]);

  // No such post → render the not-found.tsx boundary for this route.
  if (!post) notFound();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <Link href="/posts" className="text-sm text-indigo-600 hover:underline">
        ← Back to feed
      </Link>

      <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {post.selectedFile ? (
          // eslint-disable-next-line @next/next/no-img-element -- base64 data URL
          <img
            src={post.selectedFile}
            alt={post.title}
            className="max-h-96 w-full rounded-xl object-cover"
          />
        ) : null}

        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{post.name}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900">{post.title}</h1>

        {post.tags.length ? (
          <p className="text-sm text-indigo-500">
            {post.tags.map((t) => `#${t}`).join(" ")}
          </p>
        ) : null}

        <p className="whitespace-pre-line text-slate-700">{post.message}</p>

        <p className="text-sm text-slate-500">{post.likes.length} likes</p>
      </article>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <CommentSection post={post} currentUser={user} />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          You might also like
        </h2>
        {/* Streamed separately: the post above shows instantly while these load. */}
        <Suspense
          fallback={<p className="text-sm text-slate-400">Loading suggestions…</p>}
        >
          <RecommendedPosts tags={post.tags} excludeId={post._id} />
        </Suspense>
      </section>
    </div>
  );
}
