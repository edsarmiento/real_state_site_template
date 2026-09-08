export type CatalogOfferFilter = "rent" | "sale" | "all";

export function parseCatalogOfferFilter(
  value: string | undefined,
): CatalogOfferFilter {
  const v = value?.trim().toLowerCase();
  if (v === "venta" || v === "sale") return "sale";
  if (v === "renta" || v === "rent") return "rent";
  if (v === "todas" || v === "all") return "all";
  return "all";
}

export function catalogOfferQueryValue(filter: CatalogOfferFilter): string {
  if (filter === "sale") return "venta";
  if (filter === "all") return "todas";
  return "renta";
}
