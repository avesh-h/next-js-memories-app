import Link from "next/link";
import type { Post } from "@/lib/posts/types";
import type { SessionUser } from "@/lib/types";
import { CommentForm } from "./CommentForm";

/**
 * Comment list + form. This is a Server Component: it renders the comments from
 * server data (`post.comments`) and delegates only the interactive input to the
 * client `<CommentForm>`. Comments are stored as "Name:text" strings by the
 * backend, so we split on the first ":" to show the author.
 */
export function CommentSection({
  post,
  currentUser,
}: {
  post: Post;
  currentUser: SessionUser | null;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Comments ({post.comments.length})
      </h2>

      {post.comments.length ? (
        <ul className="flex flex-col gap-2">
          {post.comments.map((c, i) => {
            const separator = c.comment.indexOf(":");
            const hasAuthor = separator > 0;
            const author = hasAuthor ? c.comment.slice(0, separator) : "User";
            const text = hasAuthor ? c.comment.slice(separator + 1) : c.comment;
            return (
              <li key={i} className="text-sm text-slate-700">
                <strong className="text-slate-900">{author}:</strong> {text}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No comments yet.</p>
      )}

      {currentUser ? (
        <CommentForm postId={post._id} />
      ) : (
        <p className="text-sm text-slate-500">
          <Link href="/login" className="font-semibold text-indigo-600">
            Sign in
          </Link>{" "}
          to leave a comment.
        </p>
      )}
    </section>
  );
}
