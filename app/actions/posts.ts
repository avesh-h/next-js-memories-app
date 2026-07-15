"use server";

import * as z from "zod";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { requireUser } from "@/lib/dal";
import { POSTS_TAG, postTag } from "@/lib/cache-tags";
import { CreatePostSchema } from "@/lib/validation/post";
import type { CommentFormState, PostFormState } from "@/lib/posts/types";

/**
 * Post write layer (the "mutations").
 *
 * Each action follows the same shape:
 *   1. requireUser()  — authorize (Vercel `server-auth-actions`: never trust the client)
 *   2. call the Post microservice via apiFetch (token attached from the cookie)
 *   3. revalidateTag(...) — invalidate the reads that showed this data
 * After invalidation, any Server Component that read the tagged data re-renders
 * with fresh content. This is the direct equivalent of RTK Query's
 * `invalidatesTags`.
 */

/** Toggle like/unlike on a post. Called from the client via useTransition. */
export async function likePost(postId: string): Promise<void> {
  await requireUser();
  await apiFetch("post", `/v1/posts/${postId}/likePost`, { method: "PATCH" });
  revalidateTag(POSTS_TAG, "max");
  revalidateTag(postTag(postId), "max");
}

/** Delete a post the current user owns. */
export async function deletePost(postId: string): Promise<void> {
  await requireUser();
  await apiFetch("post", `/v1/posts/${postId}`, { method: "DELETE" });
  revalidateTag(POSTS_TAG, "max");
  revalidateTag(postTag(postId), "max");
}

/**
 * Add a comment to a post. The backend stores the comment as a single
 * "Name:text" string (matching the legacy format), so we prefix the current
 * user's name here. Uses the `useActionState` contract to report errors.
 */
export async function commentPost(
  _prevState: CommentFormState | undefined,
  formData: FormData
): Promise<CommentFormState> {
  const user = await requireUser();

  const postId = String(formData.get("postId") ?? "");
  const comment = String(formData.get("comment") ?? "").trim();

  if (!comment) {
    return { status: "error", error: "Comment cannot be empty." };
  }

  const finalComment = `${user.name}:${comment}`;

  let result;
  try {
    result = await apiFetch("post", `/v1/posts/${postId}/commentPost`, {
      method: "POST",
      body: { finalComment },
    });
  } catch {
    return { status: "error", error: "Unable to reach the post service." };
  }

  if (!result.ok) {
    return { status: "error", error: "Could not add your comment." };
  }

  // Invalidate the post (and feed) so the new comment shows on re-render.
  revalidateTag(postTag(postId), "max");
  revalidateTag(POSTS_TAG, "max");
  return { status: "success" };
}

/** Create a new post. Uses the `useActionState` form contract. */
export async function createPost(
  _prevState: PostFormState | undefined,
  formData: FormData
): Promise<PostFormState> {
  const user = await requireUser();

  const values = {
    title: String(formData.get("title") ?? ""),
    message: String(formData.get("message") ?? ""),
    tags: String(formData.get("tags") ?? ""),
  };

  const parsed = CreatePostSchema.safeParse({
    ...values,
    selectedFile: String(formData.get("selectedFile") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const { title, message, tags, selectedFile } = parsed.data;
  const tagsArray = tags
    ? tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  let result;
  try {
    result = await apiFetch("post", "/v1/posts", {
      method: "POST",
      body: { title, message, tags: tagsArray, selectedFile, name: user.name },
    });
  } catch {
    return {
      status: "error",
      message: "Unable to reach the post service. Please try again.",
      values,
    };
  }

  if (!result.ok) {
    const message =
      (result.data as { message?: string })?.message ??
      "Could not create the post.";
    return { status: "error", message, values };
  }

  revalidateTag(POSTS_TAG, "max");
  // Outside try/catch: redirect() throws a control-flow signal.
  redirect("/posts");
}


// "max" means:

// Mark the cache as stale
// Continue serving the stale cache if necessary
// The next request will trigger a background refresh
// Users don't have to wait for regeneration

// This is called stale-while-revalidate behavior.