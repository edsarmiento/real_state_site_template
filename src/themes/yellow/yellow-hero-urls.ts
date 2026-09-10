export function yellowSafeListingArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
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
