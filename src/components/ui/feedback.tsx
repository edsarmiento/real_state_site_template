import type { ReactNode } from "react";
import { API_FIELD_LABELS, type ValidationErrors } from "@/lib/validation";

/** Inline single-line error shown above forms or near a control. */
export function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-red-600 dark:text-red-400" role="alert">
      {children}
    </p>
  );
}

/** Soft-amber callout for non-blocking warnings (e.g. upstream not reachable). */
export function WarningBanner({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
    >
      {children}
    </div>
  );
}

/** Renders Rails-style field validation errors as a grouped list. */
export function ValidationErrorList({
  errors,
  title = "Revisa los datos",
}: {
  errors: ValidationErrors;
  title?: string;
}) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
    >
      {title ? <p className="font-medium">{title}</p> : null}
      <ul
        className={title ? "mt-2 list-inside list-disc space-y-1" : "list-inside list-disc space-y-1"}
      >
        {Object.entries(errors).map(([field, messages]) => (
          <li key={field}>
            <span className="font-medium">
              {API_FIELD_LABELS[field] ?? field}
            </span>
            : {messages.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
