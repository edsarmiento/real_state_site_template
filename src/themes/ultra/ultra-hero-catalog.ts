import { cache } from "react";
import { publicApiFetch } from "@/lib/public-api-fetch";
import { listingsFromCatalogResult } from "@/themes/ultra/ultra-hero-catalog-result";
import { listingPhotoUrls } from "@/themes/ultra/ultra-hero-media";

/**
 * page.tsx heroGallery uses the first *filtered* listing. When a filter
 * returns no photos we need one unfiltered cover to keep the hero honest.
 * React cache() dedupes the call within the same request.
 */
export const fetchUnfilteredHeroPhotoUrls = cache(async (): Promise<string[]> => {
  const result = await publicApiFetch<{ listings: unknown } | null>(
    "/api/public/listings?limit=3&offset=0",
  );
  return listingPhotoUrls(listingsFromCatalogResult(result), 3);
});
