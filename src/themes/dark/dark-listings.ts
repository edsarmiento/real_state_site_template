import type { PublicListingCard } from "@/lib/listing-types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Keeps only catalog cards the theme can render.
 * Array.isArray is not enough: null, {}, and partial objects are dropped.
 */
export function isPublicListingCard(value: unknown): value is PublicListingCard {
  if (value == null || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    isNonEmptyString(item.slug) &&
    typeof item.title === "string" &&
    typeof item.rent_cents === "number" &&
    Number.isFinite(item.rent_cents) &&
    (item.offer_type === "rent" || item.offer_type === "sale") &&
    typeof item.property_type === "string" &&
    typeof item.city === "string" &&
    typeof item.currency === "string" &&
    typeof item.location_label === "string" &&
    (item.photo_url === null || typeof item.photo_url === "string") &&
    typeof item.agency_name === "string"
  );
}

export function keepValidPublicListings(input: unknown): PublicListingCard[] {
  if (!Array.isArray(input)) return [];
  return input.filter(isPublicListingCard);
}
