import type { ReactNode } from "react";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}

/** A `<fieldset>` wrapped as a card with a styled `<legend>`. */
export function Section({
  legend,
  children,
}: {
  legend: ReactNode;
  children: ReactNode;
}) {
  return (
    <fieldset className="min-w-0 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <legend className="mb-4 block w-full px-0 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        {legend}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

export type PageContainerSize = "sm" | "md" | "lg";

const containerWidth: Record<PageContainerSize, string> = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
};

export function PageContainer({
  size = "md",
  children,
  className,
}: {
  size?: PageContainerSize;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto ${containerWidth[size]} px-4 py-10 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
