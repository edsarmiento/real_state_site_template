"use client";

import { LocaleSwitcherBase } from "@/components/locale-switcher-base";
import { type SiteLocale } from "@/lib/site-i18n";

type Props = {
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  supportedLocales: SiteLocale[];
  showLocaleSwitcher: boolean;
  label: string;
  optionNames: Record<SiteLocale, string>;
};

export function UltraLocaleSwitcher({
  locale,
  defaultLocale,
  supportedLocales,
  showLocaleSwitcher,
  label,
  optionNames,
}: Props) {
  return (
    <LocaleSwitcherBase
      locale={locale}
      defaultLocale={defaultLocale}
      supportedLocales={supportedLocales}
      showLocaleSwitcher={showLocaleSwitcher}
      label={label}
      optionLabel={(option) => option.toUpperCase()}
      optionAriaLabel={(option) => optionNames[option]}
      variant="ultra"
    />
  );
}
