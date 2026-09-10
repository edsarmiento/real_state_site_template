import type { PublicSiteContent } from "@/lib/public-site-content";
import { getDictionary, localizedHref, type SiteDictionary, type SiteLocale } from "@/lib/site-i18n";
import type { SiteUi } from "@/lib/site-ui";
import { resolveThemeProps } from "@/themes/resolve-theme-props";
import type { ThemeResolvedProps } from "@/themes/theme-types";

export type UltraUi = SiteUi & {
  content: PublicSiteContent;
};

/**
 * Pure derivation of Ultra UI values from already-resolved integration props.
 * Does not fetch SiteConfig or public content.
 */
export function getUltraUi({
  content,
  config,
  locale,
}: ThemeResolvedProps): UltraUi {
  return {
    content,
    config,
    locale,
    defaultLocale: config.locale.defaultLocale,
    localeConfig: config.locale,
    dict: getDictionary(locale),
  };
}

/** Async loader for chrome (shell/header/footer) that still takes `lang`. */
export async function loadUltraUi(lang?: string): Promise<UltraUi> {
  return getUltraUi(await resolveThemeProps(lang));
}

export function ultraNavLinks(
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
