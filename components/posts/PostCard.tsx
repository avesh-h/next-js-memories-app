"use client";

import Link from "next/link";
import { useTransition } from "react";
import { likePost, deletePost } from "@/app/actions/posts";
import type { Post } from "@/lib/posts/types";

/**
 * A single post card. This is a Client Component because it has interactive
 * buttons (like / delete). Those buttons *trigger* Server Actions — the actual
 * work (auth, API call, cache invalidation) runs on the server. `useTransition`
 * gives us a pending flag while the action is in flight.
 *
 * `currentUserId` is passed down from the server (the feed page read it via the
 * DAL) — the client never reads the session itself.
 */
export function PostCard({
  post,
  currentUserId,
}: {
  post: Post;
  currentUserId: string | null;
}) {
  const [pending, startTransition] = useTransition();

  const isLoggedIn = Boolean(currentUserId);
  const hasLiked = currentUserId ? post.likes.includes(currentUserId) : false;
  const isOwner = currentUserId === post.creator;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {post.selectedFile ? (
        // eslint-disable-next-line @next/next/no-img-element -- base64 data URLs aren't served by next/image
        <img
          src={post.selectedFile}
          alt={post.title}
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-slate-100 text-slate-400">
          No image
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{post.name}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <Link
          href={`/posts/${post._id}`}
          className="text-lg font-semibold text-slate-900 transition hover:text-indigo-600"
        >
          {post.title}
        </Link>

        {post.tags.length ? (
          <p className="text-xs text-indigo-500">
            {post.tags.map((tag) => `#${tag}`).join(" ")}
          </p>
        ) : null}

        <p className="line-clamp-3 flex-1 text-sm text-slate-600">
          {post.message}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            disabled={!isLoggedIn || pending}
            onClick={() => startTransition(() => likePost(post._id))}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
              hasLiked
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title={isLoggedIn ? undefined : "Sign in to like"}
          >
            {hasLiked ? "♥" : "♡"} {post.likes.length}
          </button>

          {isOwner ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => deletePost(post._id))}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
