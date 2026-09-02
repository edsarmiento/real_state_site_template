"use client";

import { LocaleSwitcherBase } from "@/components/locale-switcher-base";
import { type SiteDictionary, type SiteLocale } from "@/lib/site-i18n";

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
  return (
    <LocaleSwitcherBase
      locale={locale}
      defaultLocale={defaultLocale}
      supportedLocales={supportedLocales}
      label={dict.localeSwitcher.label}
      optionLabel={(option) => dict.localeSwitcher[option]}
      optionAriaLabel={(option) => dict.localeSwitcher[`${option}Name`]}
      variant="default"
      className={className}
    />
  );
}
