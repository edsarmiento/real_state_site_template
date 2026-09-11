import {
  themeNameFromLayoutKey,
  type SiteLayoutKey,
} from "@/themes/theme-definitions";

/**
 * Brand accents on admin/login for resolved non-default themes only.
 * Unknown layout keys resolve to `default` (unstyled), same as THEME_REGISTRY.
 */
export function isStyledSiteLayout(
  layoutKey: SiteLayoutKey | string,
): boolean {
  return themeNameFromLayoutKey(layoutKey) !== "default";
}
