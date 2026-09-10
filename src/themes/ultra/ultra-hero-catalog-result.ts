type PhotoSource = { photo_url?: string | null };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function photoSourceFromUnknown(item: unknown): PhotoSource | null {
  if (!isRecord(item)) return null;
  const photoUrl = item.photo_url;
  if (photoUrl === undefined || photoUrl === null || typeof photoUrl === "string") {
    return { photo_url: photoUrl };
  }
  return {};
}

/**
 * `publicApiFetch` can yield `{ ok: true, data: null }` for an empty 2xx
 * body or JSON `null`. Never read `.listings` until the payload is checked.
 */
export function listingsFromCatalogResult(result: {
  ok: boolean;
  data: unknown;
}): PhotoSource[] {
  if (!result.ok || !isRecord(result.data)) return [];
  if (!Array.isArray(result.data.listings)) return [];
  return result.data.listings.flatMap((item) => {
    const source = photoSourceFromUnknown(item);
    return source ? [source] : [];
  });
}

/** Optional hero fallback: a thrown fetch must not fail UltraCatalog SSR. */
export async function listingsFromCatalogLoad(
  load: () => Promise<{ ok: boolean; data: unknown }>,
): Promise<PhotoSource[]> {
  try {
    return listingsFromCatalogResult(await load());
  } catch {
    return [];
  }
}
