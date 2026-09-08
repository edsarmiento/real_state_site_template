import { BeigeCatalog } from "@/themes/beige/beige-catalog";
import { BeigeListingDetail } from "@/themes/beige/beige-listing-detail";
import { BeigeListingLoadError } from "@/themes/beige/beige-listing-load-error";
import { BeigeLegalPage } from "@/themes/beige/beige-legal-page";
import { ElegantCatalog } from "@/themes/elegant/elegant-catalog";
import { ElegantListingDetail } from "@/themes/elegant/elegant-listing-detail";
import { ElegantListingLoadError } from "@/themes/elegant/elegant-listing-load-error";
import { ElegantLegalPage } from "@/themes/elegant/elegant-legal-page";
import { DefaultCatalog } from "@/themes/default/default-catalog";
import { DefaultListingDetail } from "@/themes/default/default-listing-detail";
import { DefaultLegalPage } from "@/themes/default/default-legal-page";
import { LuxuryCatalog } from "@/themes/luxury/luxury-catalog";
import { LuxuryListingDetail } from "@/themes/luxury/luxury-listing-detail";
import { LuxuryListingLoadError } from "@/themes/luxury/luxury-listing-load-error";
import { LuxuryLegalPage } from "@/themes/luxury/luxury-legal-page";
import {
  THEME_DEFINITIONS,
  type SiteThemeName,
} from "@/themes/theme-definitions";
import type { SiteTheme } from "@/themes/theme-types";

const LAYOUT_KEYS_BY_THEME = Object.fromEntries(
  THEME_DEFINITIONS.map((d) => [d.name, d.layoutKeys]),
) as Record<SiteThemeName, (typeof THEME_DEFINITIONS)[number]["layoutKeys"]>;

const DEFAULT_CATALOG = { pageSize: 24, heroGallery: false } as const;
const BEIGE_CATALOG = { pageSize: 12, heroGallery: true } as const;
const ELEGANT_CATALOG = { pageSize: 12, heroGallery: true } as const;

/**
 * Public themes. Add a theme: folder under src/themes/<name>/ + entry here
 * + matching row in theme-definitions.ts (layoutKeys).
 */
export const THEME_REGISTRY: Record<SiteThemeName, SiteTheme> = {
  default: {
    name: "default",
    layoutKeys: LAYOUT_KEYS_BY_THEME.default,
    catalog: DEFAULT_CATALOG,
    Catalog: DefaultCatalog,
    ListingDetail: DefaultListingDetail,
    LegalPage: DefaultLegalPage,
  },
  luxury: {
    name: "luxury",
    layoutKeys: LAYOUT_KEYS_BY_THEME.luxury,
    catalog: DEFAULT_CATALOG,
    Catalog: LuxuryCatalog,
    ListingDetail: LuxuryListingDetail,
    ListingLoadError: LuxuryListingLoadError,
    LegalPage: LuxuryLegalPage,
  },
  beige: {
    name: "beige",
    layoutKeys: LAYOUT_KEYS_BY_THEME.beige,
    catalog: BEIGE_CATALOG,
    Catalog: BeigeCatalog,
    ListingDetail: BeigeListingDetail,
    ListingLoadError: BeigeListingLoadError,
    LegalPage: BeigeLegalPage,
  },
  elegant: {
    name: "elegant",
    layoutKeys: LAYOUT_KEYS_BY_THEME.elegant,
    catalog: ELEGANT_CATALOG,
    Catalog: ElegantCatalog,
    ListingDetail: ElegantListingDetail,
    ListingLoadError: ElegantListingLoadError,
    LegalPage: ElegantLegalPage,
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
