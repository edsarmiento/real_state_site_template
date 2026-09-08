function listingPhotoKey(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
}

/** Cover first, then gallery by position. Skips empty URLs and signed-URL duplicates. */
export function listingGalleryUrls(listing: {
  photos?: { url: string | null; position: number }[] | null;
  photo_url?: string | null;
}): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];
  const push = (raw: string | null | undefined) => {
    const url = raw?.trim();
    if (!url) return;
    const key = listingPhotoKey(url);
    if (seen.has(key)) return;
    seen.add(key);
    urls.push(url);
  };

  push(listing.photo_url);
  const photos = [...(listing.photos ?? [])].sort(
    (a, b) => a.position - b.position,
  );
  for (const photo of photos) {
    push(photo.url);
  }
  return urls;
}
