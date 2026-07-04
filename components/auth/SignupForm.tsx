"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import type { AuthFormState } from "@/lib/types";
import { FormField } from "@/components/ui/FormField";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function SignupForm() {
  const [state, formAction] = useActionState<AuthFormState | undefined, FormData>(
    signup,
    undefined
  );

  // After a successful signup the backend has sent a verification email;
  // show only the success banner + a link to sign in, not the form again.
  const succeeded = state?.status === "success";

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <FormMessage message={state?.message} status={state?.status} />

      {succeeded ? (
        <p className="text-center text-sm text-slate-600">
          Already verified?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      ) : (
        <>
          <div className="flex gap-3">
            <div className="flex-1">
              <FormField
                label="First name"
                name="firstName"
                autoComplete="given-name"
                placeholder="Ada"
                defaultValue={state?.values?.firstName}
                errors={state?.errors?.firstName}
                required
              />
            </div>
            <div className="flex-1">
              <FormField
                label="Last name"
                name="lastName"
                autoComplete="family-name"
                placeholder="Lovelace"
                defaultValue={state?.values?.lastName}
                errors={state?.errors?.lastName}
                required
              />
            </div>
          </div>

          <FormField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue={state?.values?.email}
            errors={state?.errors?.email}
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 4 characters"
            errors={state?.errors?.password}
            required
          />

          <FormField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-type your password"
            errors={state?.errors?.confirmPassword}
            required
          />

          <SubmitButton label="Create account" />

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </form>
  );
}
