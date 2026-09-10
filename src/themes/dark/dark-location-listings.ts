import { cache } from "react";
import { publicApiFetch } from "@/lib/public-api-fetch";
import type { PublicListingCard } from "@/lib/listing-types";

/**
 * Location chips must stay stable when the catalog is filtered; otherwise
 * only the selected city remains and switching cities from cards breaks.
 * React cache() dedupes within the same request.
 */
export const fetchDarkLocationListings = cache(
  async (): Promise<PublicListingCard[]> => {
    const result = await publicApiFetch<{
      listings: PublicListingCard[];
    }>("/api/public/listings?limit=48&offset=0", {
      signal: AbortSignal.timeout(3000),
    });
    if (!result.ok || !Array.isArray(result.data.listings)) return [];
    return result.data.listings;
  },
);
