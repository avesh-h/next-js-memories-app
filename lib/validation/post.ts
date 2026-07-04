import * as z from "zod";

/** Validation for the create-post form. */
export const CreatePostSchema = z.object({
  title: z.string().min(1, { error: "Title is required." }).trim(),
  message: z.string().min(1, { error: "Message is required." }).trim(),
  /** Comma-separated string in the form; split into an array in the action. */
  tags: z.string().optional().default(""),
  /** Base64 data URL; optional. */
  selectedFile: z.string().optional().default(""),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
