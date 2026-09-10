import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  getDictionary,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { resolveThemeProps } from "@/themes/resolve-theme-props";
import type { ThemeResolvedProps } from "@/themes/theme-types";
import { getExecutiveCopy, type ExecutiveCopy } from "@/themes/executive/executive-copy";

export type ExecutiveUi = {
  content: PublicSiteContent;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  copy: ExecutiveCopy;
  showShareButton: boolean;
  siteOrigin: string;
};

/**
 * Pure derivation of Executive UI values from already-resolved integration props.
 * Does not fetch SiteConfig or public content.
 */
export function getExecutiveUi({
  content,
  config,
  locale,
}: ThemeResolvedProps): ExecutiveUi {
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

/** Async loader for chrome (shell/header/footer) that still takes `lang`. */
export async function loadExecutiveUi(lang?: string): Promise<ExecutiveUi> {
  return getExecutiveUi(await resolveThemeProps(lang));
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
