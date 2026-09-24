type PhotoSource = { photo_url?: string | null };

function uniqueUrls(
  urls: readonly (string | null | undefined)[],
  limit: number,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    const url = raw?.trim() ?? "";
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
    if (out.length >= limit) break;
  }
  return out;
}

export function listingPhotoUrls(
  listings: readonly PhotoSource[],
  limit = 3,
): string[] {
  return uniqueUrls(
    listings.map((item) => item.photo_url),
    limit,
  );
}

/**
 * Hero collage sources, in order:
 * 1. SiteConfig / content.hero.imageUrl
 * 2. Featured gallery already fetched for the current page (heroPhotoUrls)
 * 3. Cover photos from listings already on the page
 * 4. Optional unfiltered catalog covers (only when filters hid every photo)
 */
export function resolveHeroPhotoUrls(input: {
  configuredUrl?: string | null;
  galleryUrls?: readonly string[];
  listings: readonly PhotoSource[];
  catalogUrls?: readonly string[];
  limit?: number;
}): string[] {
  const limit = input.limit ?? 3;
  return uniqueUrls(
    [
      input.configuredUrl ?? "",
      ...(input.galleryUrls ?? []),
      ...listingPhotoUrls(input.listings, limit),
      ...(input.catalogUrls ?? []),
    ],
    limit,
  );
}

export function needsUnfilteredHeroCatalog(input: {
  hasAnyFilter: boolean;
  catalogOk: boolean;
  resolvedCount: number;
}): boolean {
  return input.catalogOk && input.hasAnyFilter && input.resolvedCount === 0;
}
