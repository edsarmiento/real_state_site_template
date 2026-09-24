import { cache } from "react";
import { publicApiFetch } from "@/lib/public-api-fetch";
import { listingsFromCatalogLoad } from "@/lib/public-hero-catalog-result";
import { listingPhotoUrls } from "@/lib/public-hero-media";

/**
 * page.tsx heroGallery uses the first *filtered* listing. When a filter
 * returns no photos we need one unfiltered cover to keep the hero honest.
 * React cache() dedupes the call within the same request.
 */
export const fetchUnfilteredHeroPhotoUrls = cache(async (): Promise<string[]> => {
  const listings = await listingsFromCatalogLoad(() =>
    publicApiFetch<{ listings: unknown } | null>(
      "/api/public/listings?limit=3&offset=0",
      { signal: AbortSignal.timeout(3000) },
    ),
  );
  return listingPhotoUrls(listings, 3);
});
