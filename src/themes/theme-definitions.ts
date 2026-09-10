/**
 * Layout keys ↔ theme names (no React).
 * Keep in sync with THEME_REGISTRY entries in theme-registry.ts.
 *
 * Split from the registry so resolved-site-config can import keys without
 * pulling Catalog/ListingDetail (avoids a getSiteUi ↔ registry cycle).
 */
export const THEME_DEFINITIONS = [
  { name: "default", layoutKeys: ["default"] },
  { name: "luxury", layoutKeys: ["deo", "luxury"] },
  { name: "beige", layoutKeys: ["beige"] },
  { name: "elegant", layoutKeys: ["elegant"] },
  { name: "orange", layoutKeys: ["orange"] },
  { name: "ultra", layoutKeys: ["ultra"] },
  { name: "yellow", layoutKeys: ["yellow"] },
] as const;

export type SiteThemeName = (typeof THEME_DEFINITIONS)[number]["name"];

export type SiteLayoutKey =
  (typeof THEME_DEFINITIONS)[number]["layoutKeys"][number];

export const SITE_LAYOUT_KEYS: readonly SiteLayoutKey[] =
  THEME_DEFINITIONS.flatMap((d) => [...d.layoutKeys]);

export function isSiteLayoutKey(value: string): value is SiteLayoutKey {
  return (SITE_LAYOUT_KEYS as readonly string[]).includes(value);
}

export function themeNameFromLayoutKey(
  layoutKey: SiteLayoutKey | string,
): SiteThemeName {
  const value = layoutKey.trim().toLowerCase();
  for (const def of THEME_DEFINITIONS) {
    if ((def.layoutKeys as readonly string[]).includes(value)) {
      return def.name;
    }
  }
  return "default";
}

/** Normalize unknown or missing layout keys to a known key (fallback: default). */
export function normalizeLayoutKey(
  layoutKey?: string | null,
): SiteLayoutKey {
  if (layoutKey == null) return "default";
  const value = layoutKey.trim().toLowerCase();
  if (isSiteLayoutKey(value)) return value;
  return "default";
}
