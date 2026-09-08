type ListingPhotoSource = {
  city?: string | null;
  location_label?: string | null;
  photo_url?: string | null;
};

function normalizeCity(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function cityKey(value: string): string {
  return normalizeCity(value).split(",")[0]?.trim() || "";
}

export function listingMatchesLocation(
  listing: ListingPhotoSource,
  city: string | undefined,
): boolean {
  const needle = city ? cityKey(city) : "";
  if (!needle) return false;
  return (
    cityKey(listing.city || "") === needle ||
    cityKey(listing.location_label || "") === needle
  );
}

export function representativeListingPhoto(
  city: string | undefined,
  listings: ListingPhotoSource[],
): string | null {
  if (!cityKey(city || "")) return null;

  const photo = listings
    .filter((listing) => listingMatchesLocation(listing, city))
    .map((listing) => listing.photo_url?.trim())
    .find((candidate): candidate is string => Boolean(candidate));

  return photo || null;
}
