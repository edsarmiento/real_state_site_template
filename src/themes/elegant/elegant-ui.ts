import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  getDictionary,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { resolveThemeProps } from "@/themes/resolve-theme-props";
import type { ThemeResolvedProps } from "@/themes/theme-types";

export {
  elegantBrandInitials,
  formatElegantPriceParts,
  resolveElegantCurrency,
} from "@/themes/elegant/elegant-brand";
export { elegantContentHref } from "@/themes/elegant/elegant-format";

export type ElegantUi = {
  content: PublicSiteContent;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  showShareButton: boolean;
  siteOrigin: string;
};

/**
 * Pure derivation of Elegant UI values from already-resolved integration props.
 * Does not fetch SiteConfig or public content.
 */
export function getElegantUi({
  content,
  config,
  locale,
}: ThemeResolvedProps): ElegantUi {
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
export async function loadElegantUi(lang?: string): Promise<ElegantUi> {
  return getElegantUi(await resolveThemeProps(lang));
}

export function elegantNavLinks(
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
