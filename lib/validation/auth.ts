import * as z from "zod";

/**
 * Form validation schemas (shared shape for client hints + server enforcement).
 *
 * The backend User model requires a name, a regex-valid email, and a password
 * of at least 4 characters, so we mirror those minimums here and add a
 * confirm-password check for the signup form.
 */

export const LoginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).trim(),
  password: z.string().min(1, { error: "Password is required." }),
});

export const SignupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { error: "First name is required." })
      .trim(),
    lastName: z.string().min(1, { error: "Last name is required." }).trim(),
    email: z.email({ error: "Please enter a valid email address." }).trim(),
    password: z
      .string()
      .min(4, { error: "Password must be at least 4 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
