import type { PublicListingCard } from "@/lib/listing-types";
import type { PublicLocation } from "@/lib/public-site-content";

const MAX_ID_LEN = 64;
const MAX_NAME_LEN = 80;
const MAX_FILTER_LEN = 80;
const MAX_LOCATIONS = 12;

export function normalizeDarkCity(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function darkCityKey(value: string): string {
  return normalizeDarkCity(value).split(",")[0]?.trim() || "";
}

/** Prefer mixed-case labels; soften ALL CAPS / all-lowercase catalog values. */
export function readableDarkCityName(raw: string): string {
  const value = raw.trim();
  if (!value) return value;
  const letters = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]/g, "");
  if (!letters) return value.slice(0, MAX_NAME_LEN);
  const isAllUpper = letters === letters.toUpperCase();
  const isAllLower = letters === letters.toLowerCase();
  if (!isAllUpper && !isAllLower) return value.slice(0, MAX_NAME_LEN);
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((part) =>
      part
        .split("-")
        .map((chunk) =>
          chunk ? chunk.charAt(0).toUpperCase() + chunk.slice(1) : chunk,
        )
        .join("-"),
    )
    .join(" ")
    .slice(0, MAX_NAME_LEN);
}

export function representativeDarkCityPhoto(
  city: string | undefined,
  listings: PublicListingCard[],
): string | null {
  if (!city) return null;
  const needle = darkCityKey(city);
  if (!needle) return null;
  const match = listings.find((listing) => {
    if (darkCityKey(listing.city || "") !== needle) return false;
    return Boolean(listing.photo_url?.trim());
  });
  return match?.photo_url?.trim() || null;
}

/**
 * Editorial SiteConfig locations win when present.
 * Otherwise group catalog listings by structured `city` (never titles).
 */
export function resolveDarkLocations(
  configured: PublicLocation[],
  listings: PublicListingCard[],
): {
  locations: PublicLocation[];
  inconsistencies: string[];
} {
  const inconsistencies: string[] = [];

  if (configured.length > 0) {
    const locations: PublicLocation[] = [];
    const seen = new Set<string>();
    for (const location of configured) {
      const filterCity = location.filter.city?.trim();
      if (!filterCity) {
        inconsistencies.push(
          `Ubicación editorial "${location.name}" sin filter.city estructurado; omitida.`,
        );
        continue;
      }
      const key = darkCityKey(filterCity);
      if (!key) continue;
      if (seen.has(key)) {
        inconsistencies.push(
          `Ubicación editorial duplicada tras normalizar: "${location.name}" / "${filterCity}".`,
        );
        continue;
      }
      seen.add(key);
      locations.push({
        ...location,
        name: location.name?.trim() || readableDarkCityName(filterCity),
        filter: { ...location.filter, city: filterCity.slice(0, MAX_FILTER_LEN) },
      });
      if (locations.length >= MAX_LOCATIONS) break;
    }
    return { locations, inconsistencies };
  }

  const seen = new Set<string>();
  const locations: PublicLocation[] = [];
  for (const listing of listings) {
    const city = listing.city?.trim();
    if (!city) continue;
    const key = darkCityKey(city);
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    locations.push({
      id: key.slice(0, MAX_ID_LEN),
      name: readableDarkCityName(city),
      filter: { city: city.slice(0, MAX_FILTER_LEN) },
    });
    if (locations.length >= MAX_LOCATIONS) break;
  }
  return { locations, inconsistencies };
}
