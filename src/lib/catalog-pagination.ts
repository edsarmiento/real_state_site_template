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
  siblingCount = 1,
): Array<number | "ellipsis"> {
  const siblings =
    Number.isSafeInteger(siblingCount) && siblingCount > 0 ? siblingCount : 1;
  if (total <= 1) return [1];
  // Show every page while the list stays short enough that ellipsis adds little value.
  if (total <= 2 * siblings + 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  const set = new Set<number>([1, total]);
  const windowCurrent = Math.min(Math.max(current, 1), total);
  for (
    let n = windowCurrent - siblings;
    n <= windowCurrent + siblings;
    n += 1
  ) {
    if (n >= 1 && n <= total) set.add(n);
  }
  if (windowCurrent <= siblings + 2) {
    for (let n = 2; n <= siblings + 3; n += 1) {
      if (n < total) set.add(n);
    }
  }
  if (windowCurrent >= total - (siblings + 1)) {
    for (let n = total - (siblings + 2); n <= total - 1; n += 1) {
      if (n > 1) set.add(n);
    }
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

/** @deprecated Prefer theme.catalog.pageSize; kept for orange theme modules. */
export const ORANGE_CATALOG_PAGE_SIZE = 12;

export function catalogPageOffset(page: number, pageSize: number): number {
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(pageSize) ||
    pageSize < 1 ||
    page - 1 > Math.floor(Number.MAX_SAFE_INTEGER / pageSize)
  ) {
    return 0;
  }
  return (page - 1) * pageSize;
}

export type CatalogPagination = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  offset: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  previousPage: number | null;
  nextPage: number | null;
  outOfRange: boolean;
};

export function getCatalogPagination({
  page,
  pageSize,
  total,
}: {
  page: number;
  pageSize: number;
  total: number;
}): CatalogPagination {
  const safePageSize =
    Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : 0;
  const totalItems = Number.isSafeInteger(total) && total > 0 ? total : 0;
  const totalPages = catalogTotalPages(totalItems, safePageSize);
  const requestedPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  const outOfRange = totalPages > 0 && requestedPage > totalPages;
  const currentPage =
    totalPages === 0 ? 1 : Math.min(requestedPage, totalPages);
  const hasPreviousPage = totalPages > 0 && currentPage > 1;
  const hasNextPage = totalPages > 0 && currentPage < totalPages;

  return {
    currentPage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
    offset: catalogPageOffset(currentPage, safePageSize),
    hasPreviousPage,
    hasNextPage,
    previousPage: hasPreviousPage ? currentPage - 1 : null,
    nextPage: hasNextPage ? currentPage + 1 : null,
    outOfRange,
  };
}

/** Orange catalog search params (oferta as Spanish slug when set). */
export function orangeCatalogSearchParams(input: {
  oferta: string;
  city: string;
  propertyType: string;
  bedrooms: string;
}): Record<string, string> {
  const params: Record<string, string> = {};
  if (input.oferta && input.oferta !== "todas") {
    params.oferta = input.oferta;
  }
  if (input.city.trim()) params.city = input.city.trim();
  if (input.propertyType) params.tipo = input.propertyType;
  if (input.bedrooms) params.recamaras = input.bedrooms;
  return params;
}

/** Changes only `page` and always returns to the catalog anchor. */
export function catalogPageHref(baseHref: string, page: number): string {
  const url = new URL(baseHref, "https://catalog.invalid");
  if (page > 1) url.searchParams.set("page", String(page));
  else url.searchParams.delete("page");
  url.hash = "propiedades";
  return `${url.pathname}${url.search}${url.hash}`;
}
