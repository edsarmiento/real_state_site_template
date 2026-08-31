"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { localizedHref, type SiteLocale } from "@/lib/site-i18n";

type Props = {
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  supportedLocales: SiteLocale[];
  label: string;
  optionNames: Record<SiteLocale, string>;
};

export function LuxuryLocaleSwitcher({
  locale,
  defaultLocale,
  supportedLocales,
  label,
  optionNames,
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
              aria-label={optionNames[option]}
              aria-pressed={selected}
              aria-current={selected ? "true" : undefined}
              onClick={() => select(option)}
            >
              {option.toUpperCase()}
            </button>
          </span>
        );
      })}
    </div>
  );
}