"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { createPost } from "@/app/actions/posts";
import { FormField } from "@/components/ui/FormField";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { PostFormState } from "@/lib/posts/types";

/**
 * Create-post form. Client Component because it needs file handling and form
 * state. It reads the chosen image as a base64 data URL in the browser (the
 * backend stores `selectedFile` as a string), stashes it in a hidden input, and
 * submits everything to the `createPost` Server Action via `useActionState`.
 */
export function CreatePostForm() {
  const [state, formAction] = useActionState<PostFormState | undefined, FormData>(
    createPost,
    undefined
  );
  const [preview, setPreview] = useState("");

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview("");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state?.message} status="error" />

      <FormField
        label="Title"
        name="title"
        defaultValue={state?.values?.title}
        errors={state?.errors?.title}
      />
      <FormField
        label="Message"
        name="message"
        as="textarea"
        defaultValue={state?.values?.message}
        errors={state?.errors?.message}
      />
      <FormField
        label="Tags (comma separated)"
        name="tags"
        placeholder="travel, sunset, friends"
        defaultValue={state?.values?.tags}
        errors={state?.errors?.tags}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-indigo-600"
        />
        {/* The base64 string travels to the server action in this hidden input. */}
        <input type="hidden" name="selectedFile" value={preview} />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local preview of a base64 data URL
          <img
            src={preview}
            alt="Preview"
            className="mt-2 h-40 w-full rounded-lg object-cover"
          />
        ) : null}
      </div>

      <SubmitButton label="Create memory" />
    </form>
  );
}
