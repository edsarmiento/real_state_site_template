import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import {
  getDictionary,
  resolveRequestLocale,
  type SiteDictionary,
  type SiteLocale,
  type SiteLocaleConfig,
} from "@/lib/site-i18n";
import type { ResolvedSiteConfig } from "@/lib/site-config-types";

export type SiteUi = {
  config: ResolvedSiteConfig;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  localeConfig: SiteLocaleConfig;
  dict: SiteDictionary;
};

export async function getSiteUi(lang?: string): Promise<SiteUi> {
  const config = await getResolvedSiteConfig();
  const locale = resolveRequestLocale(lang, config.locale);

  return {
    config,
    locale,
    defaultLocale: config.locale.defaultLocale,
    localeConfig: config.locale,
    dict: getDictionary(locale),
  };
}
