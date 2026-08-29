import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number | null | undefined | ReactNode;
};

function formatDetailValue(value: Props["value"]): ReactNode {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" && value === "") return "—";
  if (typeof value === "number") return String(value);
  return value;
}

/** Label/value row for entity detail pages (`<dl>` children). */
export function DetailRow({ label, value }: Props) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-zinc-100 py-3 last:border-0 dark:border-zinc-800 sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="text-sm text-zinc-900 dark:text-zinc-100 sm:col-span-2">
        {formatDetailValue(value)}
      </dd>
    </div>
  );
}
