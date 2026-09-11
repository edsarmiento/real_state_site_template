import { listingGalleryUrls } from "@/lib/listing-gallery";
import type { ListingPhoto } from "@/lib/listing-types";

/** Resolve ordered photo URLs for the public listing gallery. */
export function listingGalleryPhotoUrls(
  photos: ListingPhoto[],
  fallbackUrl?: string | null,
): string[] {
  const urls = listingGalleryUrls({ photos });
  return urls.length > 0 ? urls : listingGalleryUrls({ photo_url: fallbackUrl });
}
