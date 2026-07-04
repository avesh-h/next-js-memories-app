/**
 * Cache tag constants — the single source of truth for tag strings.
 *
 * Reads tag their `fetch` with these; mutations invalidate the same tags via
 * `revalidateTag`. Keeping them here prevents a read and its invalidating
 * mutation from drifting apart (the classic "mismatched tag string" bug).
 */

/** The whole posts feed. */
export const POSTS_TAG = "posts";

/** A single post by id. */
export const postTag = (id: string) => `post:${id}`;
