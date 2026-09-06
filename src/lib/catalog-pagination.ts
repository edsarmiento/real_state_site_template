/** Invalid, missing, zero, decimal or text values become page 1. */
export function parseCatalogPage(raw: string): number {
  const value = raw.trim();
  if (!/^[1-9]\d{0,8}$/.test(value)) return 1;
  return Number(value);
}

export function catalogTotalPages(total: number, pageSize: number): number {
  if (total <= 0) return 0;
  return Math.max(1, Math.ceil(total / Math.max(pageSize, 1)));
}

export type ResolvedCatalogPage = {
  requestedPage: number;
  page: number;
  totalPages: number;
  /** True when listings exist but the requested page is past the last page. */
  outOfRange: boolean;
};

/**
 * Maps a URL `page` query to a safe page index.
 * With `total === 0`, keeps the parsed page and does not mark out-of-range
 * (empty catalog is a real empty state).
 * With `total > 0` and `page > totalPages`, clamps to the last valid page.
 */
export function resolveCatalogPage(
  rawPage: string,
  total: number,
  pageSize: number,
): ResolvedCatalogPage {
  const requestedPage = parseCatalogPage(rawPage);
  const totalPages = catalogTotalPages(total, pageSize);
  if (total <= 0) {
    return {
      requestedPage,
      page: requestedPage,
      totalPages: 0,
      outOfRange: false,
    };
  }
  if (requestedPage > totalPages) {
    return {
      requestedPage,
      page: totalPages,
      totalPages,
      outOfRange: true,
    };
  }
  return {
    requestedPage,
    page: requestedPage,
    totalPages,
    outOfRange: false,
  };
}

export function catalogPageItems(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  if (total <= 1) return [1];
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  const set = new Set<number>([1, total]);
  const windowCurrent = Math.min(Math.max(current, 1), total);
  for (let n = windowCurrent - 1; n <= windowCurrent + 1; n += 1) {
    if (n >= 1 && n <= total) set.add(n);
  }
  if (windowCurrent <= 3) {
    set.add(2);
    set.add(3);
    set.add(4);
  }
  if (windowCurrent >= total - 2) {
    set.add(total - 3);
    set.add(total - 2);
    set.add(total - 1);
  }
  const sorted = [...set].sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) items.push("ellipsis");
    items.push(sorted[i]);
  }
  return items;
}

/** Shared public catalog query params (`?oferta=&city=&page=`). */
export function catalogSearchParams(input: {
  oferta: "all" | "sale" | "rent";
  city: string;
  propertyType: string;
  bedrooms: string;
  page?: number;
}): Record<string, string> {
  const params: Record<string, string> = {};
  if (input.oferta === "sale") params.oferta = "venta";
  if (input.oferta === "rent") params.oferta = "renta";
  if (input.city.trim()) params.city = input.city.trim();
  if (input.propertyType) params.tipo = input.propertyType;
  if (input.bedrooms) params.recamaras = input.bedrooms;
  if (input.page && input.page > 1) params.page = String(input.page);
  return params;
}
