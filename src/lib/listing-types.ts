import type { SiteDictionary } from "@/lib/site-i18n";
import { formatBathroomsCount, formatBathroomsLabel } from "@/lib/bathrooms";

export type ListingStatus = "draft" | "published" | "paused";
export type ListingOfferType = "rent" | "sale";
export type CatalogOfferFilter = ListingOfferType | "all";

export type ListingPhoto = {
  id: number;
  url: string | null;
  position: number;
};

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
  bathrooms: number | null;
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
  bathrooms: number | null;
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

export function parseCatalogOfferFilter(
  value: string | undefined,
): CatalogOfferFilter {
  const v = value?.trim().toLowerCase();
  if (v === "venta" || v === "sale") return "sale";
  if (v === "renta" || v === "rent") return "rent";
  if (v === "todas" || v === "all") return "all";
  return "all";
}

export function catalogOfferQueryValue(filter: CatalogOfferFilter): string {
  if (filter === "sale") return "venta";
  if (filter === "all") return "todas";
  return "renta";
}

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

export type ListingSpec = { label: string; value: string };

export function listingPublicSpecsLocalized(
  listing: {
    property_type: string;
    bedrooms: number | null;
    bathrooms: number | null;
    built_area: string | null;
    land_area?: string | null;
  },
  dict: SiteDictionary,
): ListingSpec[] {
  const specs: ListingSpec[] = [];
  const land = listing.property_type === "land";

  if (!land && listing.bedrooms != null) {
    specs.push({
      label: dict.listing.specs.bedrooms,
      value: String(listing.bedrooms),
    });
  }
  if (!land && listing.bathrooms != null) {
    specs.push({
      label: dict.listing.specs.bathrooms,
      value: formatBathroomsCount(listing.bathrooms),
    });
  }
  if (listing.land_area) {
    specs.push({
      label: dict.listing.specs.land,
      value: `${listing.land_area} m²`,
    });
  }
  if (listing.built_area && !land) {
    specs.push({
      label: dict.listing.specs.built,
      value: `${listing.built_area} m²`,
    });
  }
  if (land && listing.built_area && !listing.land_area) {
    specs.push({
      label: dict.listing.specs.land,
      value: `${listing.built_area} m²`,
    });
  }

  return specs;
}

export function listingCardSpecLine(listing: {
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  built_area: string | null;
  land_area?: string | null;
}): string {
  const parts: string[] = [];
  const land = listing.property_type === "land";

  if (!land && listing.bedrooms != null) {
    parts.push(`${listing.bedrooms} rec.`);
  }
  if (!land && listing.bathrooms != null) {
    parts.push(formatBathroomsLabel(listing.bathrooms));
  }
  if (listing.land_area) {
    parts.push(`${listing.land_area} m²`);
  } else if (listing.built_area) {
    parts.push(`${listing.built_area} m²`);
  }

  return parts.join(" · ");
}

export function parseApiFailureMessage(data: unknown): string {
  if (!data || typeof data !== "object") return "No se pudo completar la solicitud.";
  const obj = data as Record<string, unknown>;
  if (typeof obj.error === "string") return obj.error;
  if (typeof obj.message === "string") return obj.message;
  const errors = obj.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    return errors.map(String).join(". ");
  }
  if (errors && typeof errors === "object") {
    return Object.values(errors as Record<string, unknown>)
      .flat()
      .map(String)
      .join(". ");
  }
  return "No se pudo completar la solicitud.";
}
