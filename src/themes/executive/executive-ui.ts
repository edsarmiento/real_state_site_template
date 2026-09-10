import { getPublicSiteContent } from "@/lib/public-site-content";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import {
  getDictionary,
  localizedHref,
  resolveRequestLocale,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { getExecutiveCopy, type ExecutiveCopy } from "@/themes/executive/executive-copy";

export type ExecutiveUi = {
  content: Awaited<ReturnType<typeof getPublicSiteContent>>;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  copy: ExecutiveCopy;
  showShareButton: boolean;
  siteOrigin: string;
};

export async function getExecutiveUi(lang?: string): Promise<ExecutiveUi> {
  const [content, config] = await Promise.all([
    getPublicSiteContent(),
    getResolvedSiteConfig(),
  ]);
  const locale = resolveRequestLocale(lang, content.locale);
  return {
    content,
    locale,
    defaultLocale: content.locale.defaultLocale,
    dict: getDictionary(locale),
    copy: getExecutiveCopy(locale),
    showShareButton: config.showShareButton,
    siteOrigin: config.siteOrigin,
  };
}

export function executiveNavLinks(
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

export {
  executiveBrandInitial,
  formatExecutivePriceParts,
  resolveExecutiveCurrency,
} from "@/themes/executive/executive-brand";
