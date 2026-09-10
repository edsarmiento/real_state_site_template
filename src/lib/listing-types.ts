import { listingPublicPath } from "@/lib/listing-public-path";
import { localizedPropertyTypeLabel } from "@/lib/property-labels";
import { isAbsentSpecValue } from "@/lib/listing-spec-value";
import {
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";

export type ListingStatus = "draft" | "published" | "paused";
export type ListingOfferType = "rent" | "sale";
export type CatalogOfferFilter = ListingOfferType | "all";

export type ListingPhoto = {
  id: number;
  url: string | null;
  position: number;
};

export { listingGalleryUrls } from "./listing-gallery";
export { isAbsentSpecValue };

export type StaffListing = {
  id: number;
  account_id: number;
  unit_id: number;
  title: string;
  description: string | null;
  rent_cents: number;
  currency: string;
  slug: string;
  status: ListingStatus;
  offer_type: ListingOfferType;
  city: string;
  state_or_region: string | null;
  colony: string | null;
  property_type: string;
  bedrooms: number | null;
  bathrooms: string | null;
  built_area: string | null;
  land_area: string | null;
  show_exact_address: boolean;
  contact_phone: string | null;
  street_address: string | null;
  published_at: string | null;
  property_id: number | null;
  unit_name: string | null;
  property_name: string | null;
  latitude: number | null;
  longitude: number | null;
  photos: ListingPhoto[];
};

export type ListingInquiry = {
  id: number;
  listing_id: number;
  listing_title: string | null;
  listing_slug: string | null;
  listing_offer_type?: ListingOfferType | null;
  name: string;
  phone: string | null;
  message: string;
  created_at: string;
};

export type PublicListingCard = {
  slug: string;
  title: string;
  rent_cents: number;
  currency: string;
  offer_type: ListingOfferType;
  city: string;
  state_or_region: string | null;
  colony: string | null;
  location_label: string;
  property_type: string;
  bedrooms: number | null;
  bathrooms: string | null;
  built_area: string | null;
  land_area: string | null;
  photo_url: string | null;
  agency_name: string;
  agency_logo_url: string | null;
  latitude?: number;
  longitude?: number;
};

export type PublicListingDetail = PublicListingCard & {
  description: string | null;
  address_label: string;
  show_exact_address: boolean;
  contact_phone: string | null;
  photos: ListingPhoto[];
  published_at: string | null;
};

export const OFFER_TYPE_LABEL: Record<ListingOfferType, string> = {
  rent: "Renta",
  sale: "Venta",
};

export function parseOfferType(
  value: string | null | undefined,
): ListingOfferType {
  return value === "sale" ? "sale" : "rent";
}

export {
  catalogOfferQueryValue,
  parseCatalogOfferFilter,
} from "./listing-offer-filter";

export function formatRentCents(cents: number, currency: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency || "MXN",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function listingPriceSuffix(offerType: ListingOfferType): string | null {
  return offerType === "rent" ? "/ mes" : null;
}

export type ListingSpecKey = "bedrooms" | "bathrooms" | "land" | "built";

export type ListingSpec = { key: ListingSpecKey; label: string; value: string };

export function listingPublicSpecsLocalized(
  listing: {
    property_type: string;
    bedrooms: number | null;
    bathrooms: string | null;
    built_area: string | null;
    land_area?: string | null;
  },
  dict: SiteDictionary,
): ListingSpec[] {
  const specs: ListingSpec[] = [];
  const land = listing.property_type === "land";

  if (!land && listing.bedrooms != null) {
    specs.push({
      key: "bedrooms",
      label: dict.listing.specs.bedrooms,
      value: String(listing.bedrooms),
    });
  }
  if (
    !land &&
    listing.bathrooms &&
    !isAbsentSpecValue(listing.bathrooms)
  ) {
    specs.push({
      key: "bathrooms",
      label: dict.listing.specs.bathrooms,
      value: listing.bathrooms.trim(),
    });
  }
  if (listing.land_area && !isAbsentSpecValue(String(listing.land_area))) {
    specs.push({
      key: "land",
      label: dict.listing.specs.land,
      value: `${listing.land_area} m²`,
    });
  }
  if (
    listing.built_area &&
    !land &&
    !isAbsentSpecValue(String(listing.built_area))
  ) {
    specs.push({
      key: "built",
      label: dict.listing.specs.built,
      value: `${listing.built_area} m²`,
    });
  }
  if (
    land &&
    listing.built_area &&
    !listing.land_area &&
    !isAbsentSpecValue(String(listing.built_area))
  ) {
    specs.push({
      key: "land",
      label: dict.listing.specs.land,
      value: `${listing.built_area} m²`,
    });
  }

  return specs;
}

export function listingCardSpecLine(
  listing: {
    property_type: string;
    bedrooms: number | null;
    bathrooms: string | null;
    built_area: string | null;
    land_area?: string | null;
  },
  specBedroomsShort?: string,
): string {
  const parts: string[] = [];
  const land = listing.property_type === "land";

  if (!land && listing.bedrooms != null) {
    parts.push(
      specBedroomsShort
        ? specBedroomsShort.replace("{count}", String(listing.bedrooms))
        : `${listing.bedrooms} rec.`,
    );
  }
  if (!land && listing.bathrooms && !isAbsentSpecValue(listing.bathrooms)) {
    parts.push(listing.bathrooms.trim());
  }
  if (listing.land_area && !isAbsentSpecValue(String(listing.land_area))) {
    parts.push(`${listing.land_area} m²`);
  } else if (
    listing.built_area &&
    !isAbsentSpecValue(String(listing.built_area))
  ) {
    parts.push(`${listing.built_area} m²`);
  }

  return parts.join(" · ");
}

export function publicListingCardModel(
  listing: PublicListingCard,
  options: {
    dict?: SiteDictionary;
    locale?: SiteLocale;
    defaultLocale?: SiteLocale;
  } = {},
) {
  const { dict, locale, defaultLocale } = options;
  const offerType = parseOfferType(listing.offer_type);
  const path = listingPublicPath(listing.slug);
  const href =
    locale && defaultLocale
      ? localizedHref(path, locale, null, defaultLocale)
      : path;

  return {
    offerType,
    href,
    suffix:
      offerType === "rent"
        ? (dict?.listing.perMonth ?? listingPriceSuffix(offerType))
        : null,
    typeLabel: localizedPropertyTypeLabel(dict, listing.property_type),
    specLine: listingCardSpecLine(listing, dict?.listing.specBedroomsShort),
    offerLabel:
      offerType === "sale"
        ? (dict?.listing.sale ?? OFFER_TYPE_LABEL.sale)
        : (dict?.listing.rent ?? OFFER_TYPE_LABEL.rent),
  };
}

export { parseApiFailureMessage } from "./listing-inquiry-request";
