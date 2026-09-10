import type { ListingPhoto } from "@/lib/listing-types";

/** Resolve ordered photo URLs for the public listing gallery. */
export function listingGalleryPhotoUrls(
  photos: ListingPhoto[],
  fallbackUrl?: string | null,
): string[] {
  const urls = photos
    .map((photo) => photo.url?.trim() || "")
    .filter(Boolean);
  if (urls.length === 0 && fallbackUrl?.trim()) {
    urls.push(fallbackUrl.trim());
  }
  return urls;
}
