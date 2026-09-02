"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { localizedHref, type SiteLocale } from "@/lib/site-i18n";

export type LocaleSwitcherBaseProps = {
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  supportedLocales: SiteLocale[];
  showLocaleSwitcher: boolean;
  label: string;
  optionLabel: (locale: SiteLocale) => string;
  optionAriaLabel: (locale: SiteLocale) => string;
  variant?: "default" | "luxury";
  className?: string;
};

export function LocaleSwitcherBase({
  locale,
  defaultLocale,
  supportedLocales,
  showLocaleSwitcher,
  label,
  optionLabel,
  optionAriaLabel,
  variant = "default",
  className = "",
}: LocaleSwitcherBaseProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!showLocaleSwitcher || supportedLocales.length < 2) return null;

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

  if (variant === "luxury") {
    return (
      <div className="luxury-locale" role="group" aria-label={label}>
        {supportedLocales.map((option, index) => {
          const selected = option === locale;
          return (
            <span key={option} className="luxury-locale__pair">
              {index > 0 ? (
                <span className="luxury-locale__rule" aria-hidden>
                  |
                </span>
              ) : null}
              <button
                type="button"
                className={
                  selected
                    ? "luxury-locale__option is-active"
                    : "luxury-locale__option"
                }
                aria-label={optionAriaLabel(option)}
                aria-pressed={selected}
                aria-current={selected ? "true" : undefined}
                onClick={() => select(option)}
              >
                {optionLabel(option)}
              </button>
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 text-sm ${className}`.trim()}
      role="group"
      aria-label={label}
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
              aria-label={optionAriaLabel(option)}
              aria-pressed={selected}
              aria-current={selected ? "true" : undefined}
              onClick={() => select(option)}
            >
              {optionLabel(option)}
            </button>
          </span>
        );
      })}
    </div>
  );
}
