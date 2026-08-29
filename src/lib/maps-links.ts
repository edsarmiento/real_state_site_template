/** Google Maps (desktop / fallback). Opens well in a new tab. */
export function googleMapsSearchUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

/** Android geo intent — opens the device maps app when possible. */
export function androidGeoIntentUrl(
  latitude: number,
  longitude: number,
  label?: string,
): string {
  const marker = label?.trim()
    ? `${latitude},${longitude}(${encodeURIComponent(label.trim())})`
    : `${latitude},${longitude}`;
  return `geo:${latitude},${longitude}?q=${marker}`;
}

/** Apple Maps — preferred on iOS. */
export function appleMapsUrl(
  latitude: number,
  longitude: number,
  label?: string,
): string {
  const params = new URLSearchParams({
    ll: `${latitude},${longitude}`,
  });
  const q = label?.trim();
  if (q) params.set("q", q);
  return `https://maps.apple.com/?${params.toString()}`;
}

export function mapsExternalUrl(
  latitude: number,
  longitude: number,
  options?: { label?: string; userAgent?: string },
): string {
  const ua = options?.userAgent ?? "";
  if (/Android/i.test(ua)) {
    return androidGeoIntentUrl(latitude, longitude, options?.label);
  }
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return appleMapsUrl(latitude, longitude, options?.label);
  }
  return googleMapsSearchUrl(latitude, longitude);
}
