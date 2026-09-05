import { DefaultCatalog } from "@/themes/default/default-catalog";
import { DefaultListingDetail } from "@/themes/default/default-listing-detail";
import { DefaultLegalPage } from "@/themes/default/default-legal-page";
import { LuxuryCatalog } from "@/themes/luxury/luxury-catalog";
import { LuxuryListingDetail } from "@/themes/luxury/luxury-listing-detail";
import { LuxuryLegalPage } from "@/themes/luxury/luxury-legal-page";
import {
  THEME_DEFINITIONS,
  type SiteThemeName,
} from "@/themes/theme-definitions";
import type { SiteTheme } from "@/themes/theme-types";

const LAYOUT_KEYS_BY_THEME = Object.fromEntries(
  THEME_DEFINITIONS.map((d) => [d.name, d.layoutKeys]),
) as Record<SiteThemeName, (typeof THEME_DEFINITIONS)[number]["layoutKeys"]>;

/**
 * Public themes. Add a theme: folder under src/themes/<name>/ + entry here
 * + matching row in theme-definitions.ts (layoutKeys).
 */
export const THEME_REGISTRY: Record<SiteThemeName, SiteTheme> = {
  default: {
    name: "default",
    layoutKeys: LAYOUT_KEYS_BY_THEME.default,
    Catalog: DefaultCatalog,
    ListingDetail: DefaultListingDetail,
    LegalPage: DefaultLegalPage,
  },
  luxury: {
    name: "luxury",
    layoutKeys: LAYOUT_KEYS_BY_THEME.luxury,
    Catalog: LuxuryCatalog,
    ListingDetail: LuxuryListingDetail,
    LegalPage: LuxuryLegalPage,
  },
};

export function getTheme(name: SiteThemeName): SiteTheme {
  return THEME_REGISTRY[name];
}

export {
  SITE_LAYOUT_KEYS,
  THEME_DEFINITIONS,
  isSiteLayoutKey,
  normalizeLayoutKey,
  themeNameFromLayoutKey,
  type SiteLayoutKey,
  type SiteThemeName,
} from "@/themes/theme-definitions";

export type { SiteTheme } from "@/themes/theme-types";
