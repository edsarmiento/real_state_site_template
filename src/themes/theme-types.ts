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
  heroPhotoUrls?: string[];
};

export type ListingDetailThemeProps = {
  listing: PublicListingDetail;
  isAdmin: boolean;
  lang?: string;
};

export type LegalPageKind = "privacy" | "terms" | "cookies";

export type LegalPageThemeProps = {
  kind: LegalPageKind;
  lang?: string;
};

export type SiteTheme = {
  name: SiteThemeName;
  /** Ops/API layout_key values that resolve to this theme. */
  layoutKeys: readonly string[];
  Catalog: (props: CatalogThemeProps) => Promise<ReactNode> | ReactNode;
  ListingDetail: (
    props: ListingDetailThemeProps,
  ) => Promise<ReactNode> | ReactNode;
  LegalPage: (props: LegalPageThemeProps) => Promise<ReactNode> | ReactNode;
};
