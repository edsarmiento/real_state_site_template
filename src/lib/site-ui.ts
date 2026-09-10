import {
  getDictionary,
  type SiteDictionary,
  type SiteLocale,
  type SiteLocaleConfig,
} from "@/lib/site-i18n";
import type { ResolvedSiteConfig } from "@/lib/site-config-types";
import { resolveThemeProps } from "@/themes/resolve-theme-props";
import type { ThemeResolvedProps } from "@/themes/theme-types";

export type SiteUi = {
  config: ResolvedSiteConfig;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  localeConfig: SiteLocaleConfig;
  dict: SiteDictionary;
};

/**
 * Pure derivation of default-theme UI values from already-resolved props.
 * Does not fetch SiteConfig.
 */
export function getSiteUiFromResolved({
  config,
  locale,
}: ThemeResolvedProps): SiteUi {
  return {
    config,
    locale,
    defaultLocale: config.locale.defaultLocale,
    localeConfig: config.locale,
    dict: getDictionary(locale),
  };
}

/** Async loader for chrome (SiteHeader/SiteFooter) that still takes `lang`. */
export async function getSiteUi(lang?: string): Promise<SiteUi> {
  return getSiteUiFromResolved(await resolveThemeProps(lang));
}
