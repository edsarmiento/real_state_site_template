import type { PublicListingCard } from "@/lib/listing-types";

function normalizeCity(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function cityKey(value: string): string {
  return normalizeCity(value).split(",")[0]?.trim() || "";
}

export function representativeListingPhoto(
  city: string | undefined,
  listings: PublicListingCard[],
): string | null {
  if (!city) return null;
  const needle = cityKey(city);
  if (!needle) return null;
  const match = listings.find((listing) => {
    if (cityKey(listing.city || "") !== needle) return false;
    return Boolean(listing.photo_url?.trim());
  });
  return match?.photo_url?.trim() || null;
}

