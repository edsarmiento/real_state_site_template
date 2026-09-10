"use client";

import { LocaleSwitcherBase } from "@/components/locale-switcher-base";
import { type SiteLocale } from "@/lib/site-i18n";
import { darkLocaleSwitcherVisible } from "@/themes/dark/dark-locale-visibility";

type Props = {
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  supportedLocales: SiteLocale[];
  showLocaleSwitcher: boolean;
  label: string;
  optionNames: Record<SiteLocale, string>;
};

export function DarkLocaleSwitcher({
  locale,
  defaultLocale,
  supportedLocales,
  showLocaleSwitcher,
  label,
  optionNames,
}: Props) {
  if (!darkLocaleSwitcherVisible(showLocaleSwitcher, supportedLocales)) {
    return null;
  }

  return (
    <div className="dark-locale">
      <LocaleSwitcherBase
        locale={locale}
        defaultLocale={defaultLocale}
        supportedLocales={supportedLocales}
        showLocaleSwitcher={showLocaleSwitcher}
        label={label}
        optionLabel={(option) => option.toUpperCase()}
        optionAriaLabel={(option) => optionNames[option]}
        className="dark-locale__base"
      />
    </div>
  );
}
