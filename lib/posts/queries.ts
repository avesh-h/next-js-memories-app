import "server-only";

import { apiFetch } from "@/lib/api";
import { POSTS_TAG, postTag } from "@/lib/cache-tags";
import type { Post, PostsPage } from "./types";

/**
 * Post read layer (the "queries").
 *
 * These are plain async functions called from Server Components. They tag their
 * fetch so mutations can invalidate them (`revalidateTag`), and set a
 * `revalidate` window so the feed is cached in production. The feed is public,
 * so we pass `auth: false` — no per-user token, which keeps the response
 * cacheable and shared across visitors.
 *
 * Note: in development, pages always render on demand (never cached), so you'll
 * see fresh data immediately; the caching is a production optimization.
 */

export async function getPosts(page: number | string = 1): Promise<PostsPage> {
  const { ok, data } = await apiFetch<PostsPage>(
    "post",
    `/v1/posts?page=${page}`,
    {
      auth: false,
      next: { tags: [POSTS_TAG], revalidate: 3600 },
    }
  );

  if (!ok || !data?.data) {
    return { data: [], currentPage: page, numberOfPages: 0 };
  }
  return data;
}

export async function getPost(id: string): Promise<Post | null> {
  const { ok, data } = await apiFetch<Post>("post", `/v1/posts/${id}`, {
    auth: false,
    next: { tags: [postTag(id)], revalidate: 3600 },
  });

  return ok ? data : null;
}

/**
 * Fetch posts that share any of the given tags — used for the "You might also
 * like" recommendations on a post's detail page. Tagged with POSTS_TAG so it's
 * invalidated whenever the feed changes.
 */
export async function getPostsByTags(tags: string[]): Promise<Post[]> {
  if (!tags.length) return [];

  const query = encodeURIComponent(tags.join(","));
  const { ok, data } = await apiFetch<PostsPage>(
    "post",
    `/v1/posts?tags=${query}`,
    {
      auth: false,
      next: { tags: [POSTS_TAG], revalidate: 3600 },
    }
  );

  return ok && data?.data ? data.data : [];
}
