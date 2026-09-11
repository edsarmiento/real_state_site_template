import type { ReactNode } from "react";
import type {
  CatalogOfferFilter,
  PublicListingCard,
  PublicListingDetail,
} from "@/lib/listing-types";
import type { PublicSiteContent } from "@/lib/public-site-content";
import type { ResolvedSiteConfig } from "@/lib/site-config-types";
import type { SiteLocale } from "@/lib/site-i18n";
import type { SiteThemeName } from "@/themes/theme-definitions";

export type { SiteThemeName } from "@/themes/theme-definitions";

/**
 * Values resolved once at the App Router integration boundary and passed into
 * every theme surface. Themes should paint these props — not re-fetch SiteConfig
 * or public content.
 */
export type ThemeResolvedProps = {
  content: PublicSiteContent;
  config: ResolvedSiteConfig;
  locale: SiteLocale;
};

/** Props that App Router routes pass into theme surfaces (no resolved site data). */
export type CatalogThemeRouteProps = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  listings: PublicListingCard[];
  /** Unfiltered cards resolved before the theme renders location links. */
  locationListings?: PublicListingCard[];
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

/** Paint contract: route props + values injected by `withResolvedThemeProps`. */
export type CatalogThemeProps = ThemeResolvedProps & CatalogThemeRouteProps;

export type ListingDetailThemeRouteProps = {
  listing: PublicListingDetail;
  isAdmin: boolean;
  lang?: string;
};

export type ListingDetailThemeProps = ThemeResolvedProps &
  ListingDetailThemeRouteProps;

export type ListingLoadErrorThemeRouteProps = {
  status: number;
  lang?: string;
};

export type ListingLoadErrorThemeProps = ThemeResolvedProps &
  ListingLoadErrorThemeRouteProps;

export type LegalPageKind = "privacy" | "terms" | "cookies";

export type LegalPageThemeRouteProps = {
  kind: LegalPageKind;
  lang?: string;
};

export type LegalPageThemeProps = ThemeResolvedProps & LegalPageThemeRouteProps;

/** Catalog fetch knobs — data-driven so `app/` never branches on theme name. */
export type ThemeCatalogOptions = {
  pageSize: number;
  /** Fetch first listing gallery URLs for the hero collage. */
  heroGallery: boolean;
  /** Resolve an unfiltered source for location cards before rendering. */
  locationListings?: boolean;
};

export type SiteTheme = {
  name: SiteThemeName;
  /** Ops/API layout_key values that resolve to this theme. */
  layoutKeys: readonly string[];
  catalog: ThemeCatalogOptions;
  /** Route-facing entry: may inject ThemeResolvedProps inside a registry wrapper. */
  Catalog: (props: CatalogThemeRouteProps) => Promise<ReactNode> | ReactNode;
  ListingDetail: (
    props: ListingDetailThemeRouteProps,
  ) => Promise<ReactNode> | ReactNode;
  ListingLoadError?: (
    props: ListingLoadErrorThemeRouteProps,
  ) => Promise<ReactNode> | ReactNode;
  LegalPage: (props: LegalPageThemeRouteProps) => Promise<ReactNode> | ReactNode;
};
