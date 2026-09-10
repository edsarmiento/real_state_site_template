import {
  buildPublicSiteContent,
  type PublicSiteContent,
} from "@/lib/public-site-content";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import type { ResolvedSiteConfig } from "@/lib/site-config-types";
import {
  resolveRequestLocale,
  type SiteLocale,
} from "@/lib/site-i18n";
import type { ThemeResolvedProps } from "@/themes/theme-types";

/**
 * Resolve public content + SiteConfig + active locale once per request for theme
 * surfaces. Reuses React `cache` on getResolvedSiteConfig and builds content
 * from that same config (no second SiteConfig fetch).
 */
export async function resolveThemeProps(
  lang?: string,
): Promise<ThemeResolvedProps> {
  const config = await getResolvedSiteConfig();
  return themePropsFromConfig(config, lang);
}

export function themePropsFromConfig(
  config: ResolvedSiteConfig,
  lang?: string,
): ThemeResolvedProps {
  const content: PublicSiteContent = buildPublicSiteContent(config);
  const locale: SiteLocale = resolveRequestLocale(lang, config.locale);
  return { content, config, locale };
}
