import { cache } from "react";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import {
  getTheme,
  themeNameFromLayoutKey,
  type SiteTheme,
} from "@/themes/theme-registry";

export { themeNameFromLayoutKey } from "@/themes/theme-registry";
export type { SiteTheme, SiteThemeName } from "@/themes/theme-registry";

/** Server-only: theme from SiteConfig.layout_key (Ops / API). */
export const resolveSiteThemeFromConfig = cache(async (): Promise<SiteTheme> => {
  const config = await getResolvedSiteConfig();
  return getTheme(themeNameFromLayoutKey(config.layoutKey));
});
