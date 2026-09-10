const MAX_FRAMES = 3;

export type ExecutiveHeroSlot =
  | { kind: "photo"; src: string }
  | { kind: "panel" };

export type ExecutiveHeroFrames = [
  ExecutiveHeroSlot,
  ExecutiveHeroSlot,
  ExecutiveHeroSlot,
];

function asUrlList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function pushUnique(urls: string[], seen: Set<string>, raw: unknown) {
  if (urls.length >= MAX_FRAMES) return;
  if (typeof raw !== "string") return;
  const url = raw.trim();
  if (!url || seen.has(url)) return;
  seen.add(url);
  urls.push(url);
}

/**
 * Cover/gallery URLs for the 3-frame hero.
 * Order: configured SiteConfig image → already-fetched gallery → listing covers.
 * Never uses a logo. Deterministic: no Math.random / Date.now.
 */
export function executiveHeroPhotoUrls(
  input?: {
    configuredUrl?: string | null;
    galleryUrls?: unknown;
    listingCoverUrls?: unknown;
  } | null,
): string[] {
  if (input == null) return [];
  const urls: string[] = [];
  const seen = new Set<string>();
  pushUnique(urls, seen, input.configuredUrl);
  for (const url of asUrlList(input.galleryUrls)) {
    pushUnique(urls, seen, url);
  }
  for (const url of asUrlList(input.listingCoverUrls)) {
    pushUnique(urls, seen, url);
  }
  return urls;
}

function slot(src: string | undefined): ExecutiveHeroSlot {
  return src ? { kind: "photo", src } : { kind: "panel" };
}

/**
 * Always three slots. Secondary frames never repeat the main photo.
 * 0 photos → three architectural panels; 1 → photo + two panels;
 * 2 → two photos + one panel; 3+ → three photos.
 */
export function executiveHeroFrames(
  urls: unknown,
): ExecutiveHeroFrames {
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const raw of asUrlList(urls)) {
    pushUnique(unique, seen, raw);
  }
  return [slot(unique[0]), slot(unique[1]), slot(unique[2])];
}
