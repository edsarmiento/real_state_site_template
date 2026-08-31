import { cache } from "react";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import type { SiteLayoutKey } from "@/lib/site-config-types";
import { getTheme } from "@/themes/theme-registry";
import type { SiteTheme, SiteThemeName } from "@/themes/theme-types";

/** Maps API `layout_key` to public theme. `deo` = Luxury (DEO piloto). */
export function themeNameFromLayoutKey(
  layoutKey: SiteLayoutKey | string,
): SiteThemeName {
  const value = layoutKey.trim().toLowerCase();
  if (value === "deo" || value === "luxury") return "luxury";
  return "default";
}

export function getSiteTheme(name: SiteThemeName): SiteTheme {
  return getTheme(name);
}

/** Server-only: theme from SiteConfig.layout_key (Ops / API). */
export const resolveSiteThemeFromConfig = cache(async (): Promise<SiteTheme> => {
  const config = await getResolvedSiteConfig();
  return getTheme(themeNameFromLayoutKey(config.layoutKey));
});

/**
 * Dev override via SITE_THEME env. Production should use SiteConfig.layout_key.
 * @deprecated Prefer resolveSiteThemeFromConfig()
 */
export function resolveSiteThemeName(
  raw: string | undefined | null,
): SiteThemeName {
  if (raw == null) return "default";
  const normalized = raw.trim().toLowerCase();
  if (normalized === "" || normalized === "default") return "default";
  if (normalized === "luxury" || normalized === "deo") return "luxury";
  console.warn("[site-theme] Unknown SITE_THEME; using default.");
  return "default";
}

/** @deprecated Prefer resolveSiteThemeFromConfig() */
export function resolveSiteTheme(): SiteTheme {
  return getTheme(resolveSiteThemeName(process.env.SITE_THEME));
}
