import { DefaultCatalog } from "@/themes/default/default-catalog";
import { DefaultListingDetail } from "@/themes/default/default-listing-detail";
import { LuxuryCatalog } from "@/themes/luxury/luxury-catalog";
import { LuxuryListingDetail } from "@/themes/luxury/luxury-listing-detail";
import type { SiteTheme, SiteThemeName } from "@/themes/theme-types";

export const THEME_REGISTRY: Record<SiteThemeName, SiteTheme> = {
  default: {
    name: "default",
    Catalog: DefaultCatalog,
    ListingDetail: DefaultListingDetail,
  },
  luxury: {
    name: "luxury",
    Catalog: LuxuryCatalog,
    ListingDetail: LuxuryListingDetail,
  },
};

export function getTheme(name: SiteThemeName): SiteTheme {
  return THEME_REGISTRY[name];
}
