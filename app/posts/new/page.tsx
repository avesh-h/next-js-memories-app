import type { Metadata } from "next";
import { requireUser } from "@/lib/dal";
import { CreatePostForm } from "@/components/posts/CreatePostForm";

export const metadata: Metadata = {
  title: "New memory · Memories",
};

/**
 * Protected page: `requireUser()` redirects to /login if there's no session,
 * so only signed-in users reach the create form. This is the DAL acting as the
 * authorization gate (Vercel `server-auth-actions`), and the `createPost`
 * action re-checks auth too — defense in depth.
 */
export default async function NewPostPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Create a memory
      </h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <CreatePostForm />
      </div>
    </div>
  );
}
