import {
  getDictionary,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import type { PublicSiteContent } from "@/lib/public-site-content";
import type { ThemeResolvedProps } from "@/themes/theme-types";

export type YellowUi = {
  content: PublicSiteContent;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  showShareButton: boolean;
  siteOrigin: string;
};

/**
 * Pure derivation of Yellow UI values from already-resolved integration props.
 * Does not fetch SiteConfig or public content.
 */
export function getYellowUi({
  content,
  config,
  locale,
}: ThemeResolvedProps): YellowUi {
  return {
    content,
    locale,
    defaultLocale: content.locale.defaultLocale,
    dict: getDictionary(locale),
    showShareButton: config.showShareButton,
    siteOrigin: config.siteOrigin,
  };
}

export function yellowNavLinks(
  dict: SiteDictionary,
  locale: SiteLocale,
  defaultLocale: SiteLocale,
): { href: string; label: string }[] {
  return [
    {
      href: localizedHref("/#propiedades", locale, null, defaultLocale),
      label: dict.nav.properties,
    },
    {
      href: localizedHref("/#sobre-nosotros", locale, null, defaultLocale),
      label: dict.nav.about,
    },
    {
      href: localizedHref("/#como-trabajamos", locale, null, defaultLocale),
      label: dict.nav.process,
    },
    {
      href: localizedHref("/#contacto", locale, null, defaultLocale),
      label: dict.nav.contact,
    },
  ];
}

export function resolveYellowCurrency(currency?: string | null): string {
  const value = currency?.trim().toUpperCase() ?? "";
  if (/^[A-Z]{3}$/.test(value)) return value;
  return "MXN";
}

function yellowCurrencySymbol(code: string, intlLocale: string): string {
  try {
    const symbol = new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")
      ?.value?.trim();
    return symbol || code;
  } catch {
    return "$";
  }
}

export function formatYellowPriceParts(
  cents: number,
  currency: string | null | undefined,
  locale: SiteLocale,
): { amount: string; currency: string } {
  const code = resolveYellowCurrency(currency);
  const intlLocale = locale === "en" ? "en-US" : "es-MX";
  const grouped = new Intl.NumberFormat(intlLocale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(cents / 100));
  const symbol = yellowCurrencySymbol(code, intlLocale);
  return { amount: `${symbol}${grouped}`, currency: code };
}
