import type { ReactNode } from "react";
import type {
  CatalogOfferFilter,
  PublicListingCard,
  PublicListingDetail,
} from "@/lib/listing-types";
import type { SiteThemeName } from "@/themes/theme-definitions";

export type { SiteThemeName } from "@/themes/theme-definitions";

export type CatalogThemeProps = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  listings: PublicListingCard[];
  total: number;
  page?: number;
  pageSize?: number;
  heading: string;
  typeLabel: string | null;
  catalogOk: boolean;
  catalogStatus: number;
  isAdmin: boolean;
  lang?: string;
  /** Optional gallery URLs used by the catalog hero. */
  heroPhotoUrls?: string[];
};

export type ListingDetailThemeProps = {
  listing: PublicListingDetail;
  isAdmin: boolean;
  lang?: string;
};

export type ListingLoadErrorThemeProps = {
  status: number;
  lang?: string;
};

export type LegalPageKind = "privacy" | "terms" | "cookies";

export type LegalPageThemeProps = {
  kind: LegalPageKind;
  lang?: string;
};

/** Catalog fetch knobs — data-driven so `app/` never branches on theme name. */
export type ThemeCatalogOptions = {
  pageSize: number;
  /** Fetch first listing gallery URLs for the hero collage. */
  heroGallery: boolean;
};

export type SiteTheme = {
  name: SiteThemeName;
  /** Ops/API layout_key values that resolve to this theme. */
  layoutKeys: readonly string[];
  catalog: ThemeCatalogOptions;
  Catalog: (props: CatalogThemeProps) => Promise<ReactNode> | ReactNode;
  ListingDetail: (
    props: ListingDetailThemeProps,
  ) => Promise<ReactNode> | ReactNode;
  ListingLoadError?: (
    props: ListingLoadErrorThemeProps,
  ) => Promise<ReactNode> | ReactNode;
  LegalPage: (props: LegalPageThemeProps) => Promise<ReactNode> | ReactNode;
};
