"use client";

import { LocaleSwitcherBase } from "@/components/locale-switcher-base";
import { type SiteDictionary, type SiteLocale } from "@/lib/site-i18n";

type Props = {
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  supportedLocales: SiteLocale[];
  showLocaleSwitcher: boolean;
  dict: SiteDictionary;
  className?: string;
};

export function SiteLocaleSwitcher({
  locale,
  defaultLocale,
  supportedLocales,
  showLocaleSwitcher,
  dict,
  className = "",
}: Props) {
  return (
    <LocaleSwitcherBase
      locale={locale}
      defaultLocale={defaultLocale}
      supportedLocales={supportedLocales}
      showLocaleSwitcher={showLocaleSwitcher}
      label={dict.localeSwitcher.label}
      optionLabel={(option) => dict.localeSwitcher[option]}
      optionAriaLabel={(option) => dict.localeSwitcher[`${option}Name`]}
      variant="default"
      className={className}
    />
  );
}
