"use client";

import { useFormStatus } from "react-dom";

/**
 * Submit button that reflects the parent <form>'s pending state via
 * `useFormStatus`. Must be rendered inside the <form> it submits.
 * Shared UI — used by every form (auth, posts, …).
 */
export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Please wait…" : label}
    </button>
  );
}
