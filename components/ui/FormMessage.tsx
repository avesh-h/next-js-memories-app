/**
 * Shared top-level success/error banner for forms. Takes primitive props so it
 * works with any form-state shape (auth, posts, …).
 */
export function FormMessage({
  message,
  status,
}: {
  message?: string;
  status?: "success" | "error";
}) {
  if (!message) return null;

  const isSuccess = status === "success";

  return (
    <p
      role={isSuccess ? "status" : "alert"}
      className={`rounded-lg border px-3.5 py-2.5 text-sm ${
        isSuccess
          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
          : "border-red-300 bg-red-50 text-red-700"
      }`}
    >
      {message}
    </p>
  );
}
