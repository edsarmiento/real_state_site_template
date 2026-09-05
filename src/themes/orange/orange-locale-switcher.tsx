"use client";

import { LocaleSwitcherBase } from "@/components/locale-switcher-base";
import type { SiteLocale } from "@/lib/site-i18n";
import { OrangeIconGlobe } from "@/themes/orange/orange-icons";

type Props = {
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  supportedLocales: SiteLocale[];
  showLocaleSwitcher: boolean;
  label: string;
  optionNames: Record<SiteLocale, string>;
};

export function OrangeLocaleSwitcher({
  locale,
  defaultLocale,
  supportedLocales,
  showLocaleSwitcher,
  label,
  optionNames,
}: Props) {
  if (!showLocaleSwitcher || supportedLocales.length < 2) return null;

  return (
    <div className="orange-locale-shell">
      <OrangeIconGlobe className="orange-locale-shell__icon" />
      <LocaleSwitcherBase
        locale={locale}
        defaultLocale={defaultLocale}
        supportedLocales={supportedLocales}
        showLocaleSwitcher={showLocaleSwitcher}
        label={label}
        optionLabel={(option) => option.toUpperCase()}
        optionAriaLabel={(option) => optionNames[option]}
        variant="orange"
      />
    </div>
  );
}
