function firstUrl(
  urls: readonly (string | null | undefined)[],
): string | null {
  for (const raw of urls) {
    const url = raw?.trim() ?? "";
    if (url) return url;
  }
  return null;
}

/**
 * Hero photograph, in order:
 * 1. Configured SiteConfig / content.hero.imageUrl
 * 2. Gallery already fetched for the current page (heroPhotoUrls)
 * 3. Cover photo from a listing already on the page
 * Returns null when the theme must fall back to the CSS composition.
 */
export function resolveDarkHeroImage(input: {
  configuredUrl?: string | null;
  galleryUrls?: readonly string[] | null;
  listingPhotoUrl?: string | null;
}): string | null {
  return firstUrl([
    input.configuredUrl,
    ...(input.galleryUrls ?? []),
    input.listingPhotoUrl,
  ]);
}
