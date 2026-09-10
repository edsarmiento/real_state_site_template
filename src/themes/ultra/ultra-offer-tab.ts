const ADMITTED_OFFER_QUERY_VALUES = new Set([
  "venta",
  "renta",
  "todas",
  "sale",
  "rent",
  "all",
]);

export function isAdmittedOfferQueryValue(value: string): boolean {
  return ADMITTED_OFFER_QUERY_VALUES.has(value.trim().toLowerCase());
}

/**
 * Offer tabs stay on the current catalog path. `PublicCatalogSearch`
 * omits `oferta` for "all" and never sets `page`.
 */
export function isUltraOfferTabHref(
  href: string,
  currentOrigin: string,
  currentPathname: string,
): boolean {
  let url: URL;
  try {
    url = new URL(href, currentOrigin);
  } catch {
    return false;
  }

  if (url.origin !== currentOrigin) return false;
  if (url.pathname !== currentPathname) return false;
  if (url.searchParams.has("page")) return false;

  const oferta = url.searchParams.get("oferta");
  if (oferta === null) return true;
  return isAdmittedOfferQueryValue(oferta);
}
