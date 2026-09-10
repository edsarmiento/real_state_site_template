import type { ListingOfferType, PublicListingCard } from "@/lib/listing-types";

function isOfferType(value: unknown): value is ListingOfferType {
  return value === "rent" || value === "sale";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isNullableFiniteNumber(value: unknown): value is number | null {
  return value === null || isFiniteNumber(value);
}

function isOptionalFiniteNumber(value: unknown): boolean {
  return value === undefined || isFiniteNumber(value);
}

export function isYellowListingCard(value: unknown): value is PublicListingCard {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const card = value as Record<string, unknown>;
  if (typeof card.slug !== "string" || !card.slug.trim()) return false;
  if (typeof card.title !== "string") return false;
  if (!isFiniteNumber(card.rent_cents)) return false;
  if (typeof card.currency !== "string") return false;
  if (!isOfferType(card.offer_type)) return false;
  if (typeof card.city !== "string") return false;
  if (!isNullableString(card.state_or_region)) return false;
  if (!isNullableString(card.colony)) return false;
  if (typeof card.location_label !== "string") return false;
  if (typeof card.property_type !== "string") return false;
  if (!isNullableFiniteNumber(card.bedrooms)) return false;
  if (!isNullableString(card.bathrooms)) return false;
  if (!isNullableString(card.built_area)) return false;
  if (!isNullableString(card.land_area)) return false;
  if (!isNullableString(card.photo_url)) return false;
  if (typeof card.agency_name !== "string") return false;
  if (!isNullableString(card.agency_logo_url)) return false;
  if (!isOptionalFiniteNumber(card.latitude)) return false;
  if (!isOptionalFiniteNumber(card.longitude)) return false;
  return true;
}

export function yellowSafeListingArray(value: unknown): PublicListingCard[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isYellowListingCard);
}

/**
 * Hero collage URLs. Priority:
 * 1. Configurable SiteConfig / public content image
 * 2. Real listing gallery URLs already fetched by page.tsx
 * 3. Catalog cover photos already in the listing cards (no extra fetch)
 * Empty array → CSS composition fallback in the theme (never a fake photo).
 * Never duplicates the same URL to fill slots.
 */
export function resolveYellowHeroUrls(
  configuredUrl: string | null | undefined,
  listingUrls: readonly string[] | null | undefined,
  catalogCovers?: readonly (string | null | undefined)[] | null,
): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];

  function push(raw: string | null | undefined) {
    const value = raw?.trim() ?? "";
    if (!value || seen.has(value) || urls.length >= 3) return;
    seen.add(value);
    urls.push(value);
  }

  push(configuredUrl);
  if (Array.isArray(listingUrls)) {
    for (const url of listingUrls) push(url);
  }
  if (Array.isArray(catalogCovers)) {
    for (const url of catalogCovers) push(url);
  }
  return urls;
}

export function yellowHeroFrameCount(urls: readonly string[]): 0 | 1 | 2 | 3 {
  const count = urls.filter((url) => url.trim()).length;
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  return 3;
}
