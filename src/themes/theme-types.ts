import type { ReactNode } from "react";
import type {
  CatalogOfferFilter,
  PublicListingCard,
  PublicListingDetail,
} from "@/lib/listing-types";

export type SiteThemeName = "default" | "luxury";

export type CatalogThemeProps = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  listings: PublicListingCard[];
  total: number;
  heading: string;
  typeLabel: string | null;
  catalogOk: boolean;
  catalogStatus: number;
  isAdmin: boolean;
  lang?: string;
};

export type ListingDetailThemeProps = {
  listing: PublicListingDetail;
  isAdmin: boolean;
  lang?: string;
};

export type SiteTheme = {
  name: SiteThemeName;
  Catalog: (props: CatalogThemeProps) => Promise<ReactNode> | ReactNode;
  ListingDetail: (
    props: ListingDetailThemeProps,
  ) => Promise<ReactNode> | ReactNode;
};
