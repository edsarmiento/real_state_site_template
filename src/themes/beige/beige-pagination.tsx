import Link from "next/link";
import { catalogPageItems } from "@/lib/catalog-pagination";
import { fillTemplate, localizedHref } from "@/lib/site-i18n";
import type { CatalogOfferFilter } from "@/lib/listing-types";
import type { SiteLocale } from "@/lib/site-i18n";
import { getBeigeCopy } from "@/themes/beige/beige-copy";

const CATALOG_HASH = "#propiedades";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function beigeCatalogSearchParams(input: {
  oferta: CatalogOfferFilter;
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

export function BeigePagination({
  page,
  totalPages,
  total,
  oferta,
  city,
  propertyType,
  bedrooms,
  locale,
  defaultLocale,
}: Props) {
  if (total <= 0 || totalPages <= 1) return null;

  const copy = getBeigeCopy(locale);
  const hrefFor = (target: number) =>
    localizedHref(
      "/",
      locale,
      beigeCatalogSearchParams({
        oferta,
        city,
        propertyType,
        bedrooms,
        page: target,
      }),
      defaultLocale,
    ) + CATALOG_HASH;

  const canPrev = page > 1;
  const canNext = page < totalPages;
  const items = catalogPageItems(page, totalPages);

  return (
    <nav className="beige-pagination mt-12" aria-label={copy.paginationAria}>
      <div className="flex items-center justify-between gap-3 md:hidden">
        {canPrev ? (
          <Link href={hrefFor(page - 1)} className="beige-page-btn">
            {copy.paginationPrev}
          </Link>
        ) : (
          <span className="beige-page-btn is-disabled" aria-disabled="true">
            {copy.paginationPrev}
          </span>
        )}
        <p className="min-w-0 flex-1 text-center text-sm font-medium text-[#2D2A26]">
          {fillTemplate(copy.paginationPageOf, {
            current: page,
            total: totalPages,
          })}
        </p>
        {canNext ? (
          <Link href={hrefFor(page + 1)} className="beige-page-btn">
            {copy.paginationNext}
          </Link>
        ) : (
          <span className="beige-page-btn is-disabled" aria-disabled="true">
            {copy.paginationNext}
          </span>
        )}
      </div>

      <div className="hidden flex-wrap items-center justify-center gap-2 md:flex">
        {canPrev ? (
          <Link href={hrefFor(page - 1)} className="beige-page-btn">
            {copy.paginationPrev}
          </Link>
        ) : (
          <span className="beige-page-btn is-disabled" aria-disabled="true">
            {copy.paginationPrev}
          </span>
        )}
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`e-${index}`}
              className="px-1 text-sm text-[#A39073]"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={hrefFor(item)}
              className={
                item === page
                  ? "beige-page-btn is-active"
                  : "beige-page-btn"
              }
              aria-label={fillTemplate(copy.goToPage, { page: item })}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </Link>
          ),
        )}
        {canNext ? (
          <Link href={hrefFor(page + 1)} className="beige-page-btn">
            {copy.paginationNext}
          </Link>
        ) : (
          <span className="beige-page-btn is-disabled" aria-disabled="true">
            {copy.paginationNext}
          </span>
        )}
      </div>
    </nav>
  );
}
