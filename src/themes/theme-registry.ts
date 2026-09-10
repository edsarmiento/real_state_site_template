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
import { OrangeCatalog } from "@/themes/orange/orange-catalog";
import { OrangeListingDetail } from "@/themes/orange/orange-listing-detail";
import { OrangeLegalPage } from "@/themes/orange/orange-legal-page";
import { UltraCatalog } from "@/themes/ultra/ultra-catalog";
import { UltraListingDetail } from "@/themes/ultra/ultra-listing-detail";
import { UltraListingLoadError } from "@/themes/ultra/ultra-listing-load-error";
import { UltraLegalPage } from "@/themes/ultra/ultra-legal-page";
import { YellowCatalog } from "@/themes/yellow/yellow-catalog";
import { YellowListingDetail } from "@/themes/yellow/yellow-listing-detail";
import { YellowListingLoadError } from "@/themes/yellow/yellow-listing-load-error";
import { YellowLegalPage } from "@/themes/yellow/yellow-legal-page";
import {
  THEME_DEFINITIONS,
  type SiteThemeName,
} from "@/themes/theme-definitions";
import type { SiteTheme } from "@/themes/theme-types";
import { withResolvedThemeProps } from "@/themes/with-resolved-theme-props";

const LAYOUT_KEYS_BY_THEME = Object.fromEntries(
  THEME_DEFINITIONS.map((d) => [d.name, d.layoutKeys]),
) as Record<SiteThemeName, (typeof THEME_DEFINITIONS)[number]["layoutKeys"]>;

const DEFAULT_CATALOG = { pageSize: 24, heroGallery: false } as const;
const BEIGE_CATALOG = { pageSize: 12, heroGallery: true } as const;
const ELEGANT_CATALOG = { pageSize: 12, heroGallery: true } as const;
const ORANGE_CATALOG = { pageSize: 12, heroGallery: true } as const;
const ULTRA_CATALOG = { pageSize: 12, heroGallery: true } as const;
const YELLOW_CATALOG = { pageSize: 12, heroGallery: true } as const;

/**
 * Public themes. Add a theme: folder under src/themes/<name>/ + entry here
 * + matching row in theme-definitions.ts (layoutKeys).
 *
 * All theme paint entries are wrapped with `withResolvedThemeProps` so App
 * routes stay fetch/delegate-only while paint components receive resolved props.
 */
export const THEME_REGISTRY: Record<SiteThemeName, SiteTheme> = {
  default: {
    name: "default",
    layoutKeys: LAYOUT_KEYS_BY_THEME.default,
    catalog: DEFAULT_CATALOG,
    Catalog: withResolvedThemeProps(DefaultCatalog),
    ListingDetail: withResolvedThemeProps(DefaultListingDetail),
    LegalPage: withResolvedThemeProps(DefaultLegalPage),
  },
  luxury: {
    name: "luxury",
    layoutKeys: LAYOUT_KEYS_BY_THEME.luxury,
    catalog: DEFAULT_CATALOG,
    Catalog: withResolvedThemeProps(LuxuryCatalog),
    ListingDetail: withResolvedThemeProps(LuxuryListingDetail),
    ListingLoadError: withResolvedThemeProps(LuxuryListingLoadError),
    LegalPage: withResolvedThemeProps(LuxuryLegalPage),
  },
  beige: {
    name: "beige",
    layoutKeys: LAYOUT_KEYS_BY_THEME.beige,
    catalog: BEIGE_CATALOG,
    Catalog: withResolvedThemeProps(BeigeCatalog),
    ListingDetail: withResolvedThemeProps(BeigeListingDetail),
    ListingLoadError: withResolvedThemeProps(BeigeListingLoadError),
    LegalPage: withResolvedThemeProps(BeigeLegalPage),
  },
  elegant: {
    name: "elegant",
    layoutKeys: LAYOUT_KEYS_BY_THEME.elegant,
    catalog: ELEGANT_CATALOG,
    Catalog: withResolvedThemeProps(ElegantCatalog),
    ListingDetail: withResolvedThemeProps(ElegantListingDetail),
    ListingLoadError: withResolvedThemeProps(ElegantListingLoadError),
    LegalPage: withResolvedThemeProps(ElegantLegalPage),
  },
  orange: {
    name: "orange",
    layoutKeys: LAYOUT_KEYS_BY_THEME.orange,
    catalog: ORANGE_CATALOG,
    Catalog: withResolvedThemeProps(OrangeCatalog),
    ListingDetail: withResolvedThemeProps(OrangeListingDetail),
    LegalPage: withResolvedThemeProps(OrangeLegalPage),
  },
  ultra: {
    name: "ultra",
    layoutKeys: LAYOUT_KEYS_BY_THEME.ultra,
    catalog: ULTRA_CATALOG,
    Catalog: withResolvedThemeProps(UltraCatalog),
    ListingDetail: withResolvedThemeProps(UltraListingDetail),
    ListingLoadError: withResolvedThemeProps(UltraListingLoadError),
    LegalPage: withResolvedThemeProps(UltraLegalPage),
  },
  yellow: {
    name: "yellow",
    layoutKeys: LAYOUT_KEYS_BY_THEME.yellow,
    catalog: YELLOW_CATALOG,
    Catalog: withResolvedThemeProps(YellowCatalog),
    ListingDetail: withResolvedThemeProps(YellowListingDetail),
    ListingLoadError: withResolvedThemeProps(YellowListingLoadError),
    LegalPage: withResolvedThemeProps(YellowLegalPage),
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
