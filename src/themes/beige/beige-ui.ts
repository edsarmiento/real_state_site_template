import { getPublicSiteContent } from "@/lib/public-site-content";
import {
  getDictionary,
  localizedHref,
  resolveRequestLocale,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";

export type BeigeUi = {
  content: Awaited<ReturnType<typeof getPublicSiteContent>>;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
};

export async function getBeigeUi(lang?: string): Promise<BeigeUi> {
  const content = await getPublicSiteContent();
  const locale = resolveRequestLocale(lang, content.locale);
  return {
    content,
    locale,
    defaultLocale: content.locale.defaultLocale,
    dict: getDictionary(locale),
  };
}

export function beigeNavLinks(
  dict: SiteDictionary,
  locale: SiteLocale,
  defaultLocale: SiteLocale,
): { href: string; label: string }[] {
  return [
    {
      href: localizedHref("/#residencial", locale, null, defaultLocale),
      label: locale === "en" ? "Properties" : "Propiedades",
    },
    {
      href: localizedHref("/#ubicaciones", locale, null, defaultLocale),
      label: dict.nav.locations,
    },
    {
      href: localizedHref("/#nosotros", locale, null, defaultLocale),
      label: dict.nav.about,
    },
    {
      href: localizedHref("/#proceso", locale, null, defaultLocale),
      label: dict.nav.process,
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
