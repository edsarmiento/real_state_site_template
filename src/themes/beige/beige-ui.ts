import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  getDictionary,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { resolveThemeProps } from "@/themes/resolve-theme-props";
import type { ThemeResolvedProps } from "@/themes/theme-types";

export type BeigeUi = {
  content: PublicSiteContent;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  showShareButton: boolean;
  siteOrigin: string;
};

/**
 * Pure derivation of Beige UI values from already-resolved integration props.
 * Does not fetch SiteConfig or public content.
 */
export function getBeigeUi({
  content,
  config,
  locale,
}: ThemeResolvedProps): BeigeUi {
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
export async function loadBeigeUi(lang?: string): Promise<BeigeUi> {
  return getBeigeUi(await resolveThemeProps(lang));
}

export function beigeNavLinks(
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

export function resolveBeigeCurrency(currency?: string | null): string {
  const value = currency?.trim().toUpperCase() ?? "";
  if (/^[A-Z]{3}$/.test(value)) return value;
  return "MXN";
}

export function formatBeigePriceParts(
  cents: number,
  currency: string | null | undefined,
  locale: SiteLocale,
): { amount: string; currency: string } {
  const code = resolveBeigeCurrency(currency);
  const grouped = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(cents / 100));
  return { amount: `$${grouped}`, currency: code };
}
