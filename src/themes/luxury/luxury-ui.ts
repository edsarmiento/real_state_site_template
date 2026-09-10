import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  getDictionary,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { resolveThemeProps } from "@/themes/resolve-theme-props";
import type { ThemeResolvedProps } from "@/themes/theme-types";

export type LuxuryUi = {
  content: PublicSiteContent;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  showShareButton: boolean;
  siteOrigin: string;
};

/**
 * Pure derivation of Luxury UI values from already-resolved integration props.
 * Does not fetch SiteConfig or public content.
 */
export function getLuxuryUi({
  content,
  config,
  locale,
}: ThemeResolvedProps): LuxuryUi {
  return {
    content,
    locale,
    defaultLocale: content.locale.defaultLocale,
    dict: getDictionary(locale),
    showShareButton: config.showShareButton,
    siteOrigin: config.siteOrigin,
  };
}

/** Async loader for chrome (shell/header/footer) that still takes `lang`. */
export async function loadLuxuryUi(lang?: string): Promise<LuxuryUi> {
  return getLuxuryUi(await resolveThemeProps(lang));
}

export function luxuryNavLinks(
  dict: SiteDictionary,
  locale: SiteLocale,
  defaultLocale: SiteLocale,
): { href: string; label: string }[] {
  return [
    {
      href: localizedHref("/#catalogo", locale, null, defaultLocale),
      label: dict.nav.properties,
    },
    {
      href: localizedHref("/#about", locale, null, defaultLocale),
      label: dict.nav.about,
    },
    {
      href: localizedHref("/#process", locale, null, defaultLocale),
      label: dict.nav.process,
    },
    {
      href: localizedHref("/#contact", locale, null, defaultLocale),
      label: dict.nav.contact,
    },
  ];
}

export function resolveLuxuryCurrency(currency?: string | null): string {
  const value = currency?.trim().toUpperCase() ?? "";
  if (/^[A-Z]{3}$/.test(value)) return value;
  return "MXN";
}

export function formatLuxuryPriceParts(
  cents: number,
  currency: string | null | undefined,
  locale: SiteLocale,
): { amount: string; currency: string } {
  const code = resolveLuxuryCurrency(currency);
  const grouped = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(cents / 100));
  return { amount: `$${grouped}`, currency: code };
}
