"use client";

import { LocaleSwitcherBase } from "@/components/locale-switcher-base";
import { type SiteLocale } from "@/lib/site-i18n";

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
  return (
    <LocaleSwitcherBase
      locale={locale}
      defaultLocale={defaultLocale}
      supportedLocales={supportedLocales}
      label={label}
      optionLabel={(option) => option.toUpperCase()}
      optionAriaLabel={(option) => optionNames[option]}
      variant="luxury"
    />
  );
}
