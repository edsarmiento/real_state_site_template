"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";

type Props = {
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  supportedLocales: SiteLocale[];
  dict: SiteDictionary;
  className?: string;
};

export function SiteLocaleSwitcher({
  locale,
  defaultLocale,
  supportedLocales,
  dict,
  className = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (supportedLocales.length < 2) return null;

  function select(next: SiteLocale) {
    if (next === locale) return;
    const href = localizedHref(
      pathname || "/",
      next,
      searchParams,
      defaultLocale,
    );
    router.replace(href, { scroll: false });
  }

  return (
    <div
      className={`flex items-center gap-1 text-sm ${className}`.trim()}
      role="group"
      aria-label={dict.localeSwitcher.label}
    >
      {supportedLocales.map((option, index) => {
        const selected = option === locale;
        return (
          <span key={option} className="inline-flex items-center gap-1">
            {index > 0 ? (
              <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
                |
              </span>
            ) : null}
            <button
              type="button"
              className={
                selected
                  ? "font-semibold text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-500 transition hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }
              aria-label={dict.localeSwitcher[`${option}Name`]}
              aria-pressed={selected}
              aria-current={selected ? "true" : undefined}
              onClick={() => select(option)}
            >
              {dict.localeSwitcher[option]}
            </button>
          </span>
        );
      })}
    </div>
  );
}
