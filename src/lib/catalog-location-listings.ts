import { cache } from "react";
import { classifyPublicApiFetchError, publicApiFetch } from "@/lib/public-api-fetch";
import type { PublicListingCard } from "@/lib/listing-types";

/**
 * Location chips must stay stable when the catalog is filtered; otherwise
 * only the selected city remains and switching cities from cards breaks.
 * React cache() dedupes within the same request.
 */
export const fetchCatalogLocationListings = cache(
  async (): Promise<PublicListingCard[]> => {
    try {
      const result = await publicApiFetch<{
        listings: PublicListingCard[];
      }>("/api/public/listings?limit=48&offset=0", {
        signal: AbortSignal.timeout(3000),
      });
      if (!result.ok || !Array.isArray(result.data?.listings)) return [];
      return result.data.listings;
    } catch (error) {
      if (classifyPublicApiFetchError(error) === "aborted") return [];
      throw error;
    }
  },
);
