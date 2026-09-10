export type YellowListingPlace = {
  city?: string | null;
  photo_url?: string | null;
};

export type YellowLocationSlot = "featured" | "stack" | "wide";

export function yellowCityKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .split(",")[0]
    ?.trim() || "";
}

export function yellowCitiesMatch(left: string, right: string): boolean {
  const a = yellowCityKey(left);
  const b = yellowCityKey(right);
  return Boolean(a) && a === b;
}

export function yellowRepresentativeListingPhoto(
  city: string | undefined,
  listings: YellowListingPlace[] | null | undefined,
): string | null {
  if (!city) return null;
  if (!Array.isArray(listings)) return null;
  const match = listings.find((listing) => {
    if (!yellowCitiesMatch(listing.city || "", city)) return false;
    return Boolean(listing.photo_url?.trim());
  });
  return match?.photo_url?.trim() || null;
}

export function yellowUniqueCities(
  listings: YellowListingPlace[] | null | undefined,
  extra?: string,
): string[] {
  const seen = new Set<string>();
  const cities: string[] = [];
  const source = Array.isArray(listings) ? listings : [];
  for (const listing of source) {
    const city = listing.city?.trim();
    if (!city) continue;
    const key = yellowCityKey(city);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    cities.push(city);
  }
  const current = extra?.trim() ?? "";
  if (current) {
    const key = yellowCityKey(current);
    if (key && !seen.has(key)) cities.unshift(current);
  }
  return cities;
}

export function yellowLocationSlot(
  index: number,
  total: number,
): YellowLocationSlot {
  if (total <= 1) return "featured";
  if (total === 2) return index === 0 ? "featured" : "stack";
  const pos = index % 4;
  if (pos === 0) return "featured";
  if (pos === 3) return "wide";
  return "stack";
}

export function yellowLocationGridClass(total: number): string {
  if (total <= 0) return "yellow-locations__grid";
  if (total === 1) return "yellow-locations__grid yellow-locations__grid--single";
  if (total === 2) return "yellow-locations__grid yellow-locations__grid--pair";
  return "yellow-locations__grid yellow-locations__grid--bento";
}

export function yellowEditorialIndex(index: number): string {
  return String(Math.max(0, index) + 1).padStart(2, "0");
}
