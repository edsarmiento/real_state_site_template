"use client";

import { LocaleSwitcherBase } from "@/components/locale-switcher-base";
import { type SiteLocale } from "@/lib/site-i18n";
import { YellowIconGlobe } from "@/themes/yellow/yellow-icons";

type Props = {
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  supportedLocales: SiteLocale[];
  showLocaleSwitcher: boolean;
  label: string;
  optionNames: Record<SiteLocale, string>;
};

export function YellowLocaleSwitcher({
  locale,
  defaultLocale,
  supportedLocales,
  showLocaleSwitcher,
  label,
  optionNames,
}: Props) {
  if (!showLocaleSwitcher || supportedLocales.length < 2) return null;

  return (
    <div className="yellow-locale">
      <span className="yellow-locale__icon" aria-hidden>
        <YellowIconGlobe className="h-3.5 w-3.5" />
      </span>
      <LocaleSwitcherBase
        locale={locale}
        defaultLocale={defaultLocale}
        supportedLocales={supportedLocales}
        showLocaleSwitcher={showLocaleSwitcher}
        label={label}
        optionLabel={(option) => option.toUpperCase()}
        optionAriaLabel={(option) => optionNames[option]}
        variant="default"
        className="yellow-locale__controls"
      />
    </div>
  );
}
