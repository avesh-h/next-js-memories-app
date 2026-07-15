"use client";

import { useActionState, useEffect, useRef } from "react";
import { commentPost } from "@/app/actions/posts";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { CommentFormState } from "@/lib/posts/types";

/**
 * Comment input. Client Component because it needs form state. On success it
 * clears the textarea; the new comment appears because the action revalidates
 * the post tag, which re-renders the (server) comment list above.
 */
export function CommentForm({ postId }: { postId: string }) {
  const [state, formAction] = useActionState<CommentFormState | undefined, FormData>(
    commentPost,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="postId" value={postId} />
      <textarea
        name="comment"
        rows={3}
        placeholder="Write a comment…"
        className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
      />
      {state?.status === "error" ? (
        <p className="text-xs text-red-600">{state.error}</p>
      ) : null}
      <div className="self-start">
        <SubmitButton label="Comment" />
      </div>
    </form>
  );
}
