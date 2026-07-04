"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { signInRequest, signUpRequest } from "@/lib/api";
import { createSession, deleteSession } from "@/lib/session";
import { LoginSchema, SignupSchema } from "@/lib/validation/auth";
import type { AuthFormState } from "@/lib/types";

const NETWORK_ERROR =
  "Unable to reach the authentication service. Please try again.";

/**
 * Sign in with email + password.
 *
 * Server Action consumed by `useActionState`. On success it creates the
 * httpOnly session cookie and redirects home; on failure it returns a state
 * object describing what went wrong so the form can show it.
 */
export async function login(
  _prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");

  const parsed = LoginSchema.safeParse({
    email,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      errors: z.flattenError(parsed.error).fieldErrors,
      values: { email },
    };
  }

  let result;
  try {
    result = await signInRequest(parsed.data);
  } catch {
    return { status: "error", message: NETWORK_ERROR, values: { email } };
  }

  if (!result.ok || !result.data?.token || !result.data?.result) {
    return {
      status: "error",
      message: result.data?.message ?? "Invalid email or password.",
      values: { email },
    };
  }

  const { result: user, token } = result.data;
  await createSession({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });

  // Outside try/catch: redirect() throws a control-flow signal that must not be caught.
  redirect("/");
}

/**
 * Register a new account.
 *
 * The backend creates the user as unverified and emails a verification link —
 * it does NOT return a token — so on success we surface a "verify your email"
 * message rather than creating a session.
 */
export async function signup(
  _prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const values = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  const parsed = SignupSchema.safeParse({
    ...values,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const { firstName, lastName, email, password } = parsed.data;

  let result;
  try {
    result = await signUpRequest({ firstName, lastName, email, password });
  } catch {
    return { status: "error", message: NETWORK_ERROR, values };
  }

  if (!result.ok) {
    return {
      status: "error",
      message: result.data?.message ?? "Could not create your account.",
      values,
    };
  }

  return {
    status: "success",
    message:
      result.data?.message ??
      "Account created! Check your email to verify your account, then sign in.",
  };
}

/** Clear the session and return to the login page. */
export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
