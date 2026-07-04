/**
 * Shared domain + form types for the auth module.
 * Plain types only (no server imports) so they can be used from client and server.
 */

/** Minimal, non-sensitive user profile stored in the session and passed to the client. */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

/** Session payload persisted in the httpOnly cookie. */
export interface Session {
  /** Backend-issued JWT used as the Bearer token when calling microservices. */
  token: string;
  user: SessionUser;
}

/**
 * Return shape for the auth Server Actions, consumed by `useActionState`.
 * `undefined` is the initial state (nothing submitted yet).
 */
export interface AuthFormState {
  /** Field-level validation errors keyed by input name. */
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  /** Top-level message (e.g. backend error, or a success notice). */
  message?: string;
  /** Distinguishes a successful outcome from an error for styling/redirects. */
  status?: "success" | "error";
  /** Values to repopulate the form with after a failed submit (never the password). */
  values?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}
