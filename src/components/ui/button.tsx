import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "dangerSolid"
  | "success"
  | "ghost";
export type ButtonSize = "md" | "sm";

/** Semantic actions — prefer these over hardcoding variants in feature UI. */
export const UPLOAD_BUTTON_VARIANT = "success" as const satisfies ButtonVariant;
export const DELETE_BUTTON_VARIANT =
  "dangerSolid" as const satisfies ButtonVariant;

const baseClasses =
  "inline-flex items-center justify-center rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white",
  secondary:
    "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800",
  danger:
    "border border-red-300 bg-white text-red-700 hover:bg-red-50 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/40",
  dangerSolid:
    "bg-red-600 text-white hover:bg-red-500 dark:bg-red-600 dark:text-white dark:hover:bg-red-500",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500",
  ghost:
    "text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-xs",
};

/**
 * Compose the Tailwind classes for a button-styled element.
 *
 * Use this when styling a `next/link` `<Link>` (or any non-`<button>` element)
 * with the same look as `<Button>`. For real `<button>` elements prefer the
 * `<Button>` component below.
 */
export function buttonClass(
  opts: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {},
): string {
  const v = opts.variant ?? "primary";
  const s = opts.size ?? "md";
  return [baseClasses, variantClasses[v], sizeClasses[s], opts.className ?? ""]
    .filter(Boolean)
    .join(" ");
}

export function uploadButtonClass(
  opts: { size?: ButtonSize; className?: string } = {},
): string {
  return buttonClass({
    variant: UPLOAD_BUTTON_VARIANT,
    size: opts.size ?? "sm",
    className: opts.className,
  });
}

export function deleteButtonClass(
  opts: { size?: ButtonSize; className?: string } = {},
): string {
  return buttonClass({
    variant: DELETE_BUTTON_VARIANT,
    size: opts.size ?? "sm",
    className: opts.className,
  });
}

/** Native `<input type="file">` chip/button styling (matches upload green). */
export const fileInputClassName =
  "block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-500 dark:text-zinc-300 dark:file:bg-emerald-600 dark:file:text-white dark:hover:file:bg-emerald-500";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, type = "button", ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonClass({ variant, size, className })}
        {...rest}
      />
    );
  },
);
