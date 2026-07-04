/**
 * Shared labeled form field (input or textarea) with inline validation errors.
 * Used across all forms (auth, posts, …). Presentational only.
 */
interface FormFieldProps {
  label: string;
  name: string;
  errors?: string[];
  as?: "input" | "textarea";
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
  required?: boolean;
  rows?: number;
}

export function FormField({
  label,
  name,
  errors,
  as = "input",
  type = "text",
  placeholder,
  defaultValue,
  autoComplete,
  required,
  rows = 4,
}: FormFieldProps) {
  const errorId = `${name}-error`;
  const hasError = Boolean(errors?.length);
  const className = `rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/40 ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-slate-300 focus:border-indigo-500"
  }`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>

      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={className}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={className}
        />
      )}

      {hasError ? (
        <p id={errorId} className="text-xs text-red-600">
          {errors!.join(" ")}
        </p>
      ) : null}
    </div>
  );
}
