import Link from "next/link";
import {
  catalogPageItems,
  catalogSearchParams,
} from "@/lib/catalog-pagination";
import { fillTemplate, localizedHref } from "@/lib/site-i18n";
import type { CatalogOfferFilter } from "@/lib/listing-types";
import type { SiteLocale } from "@/lib/site-i18n";
import type { ExecutiveCopy } from "@/themes/executive/executive-copy";

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
  copy: ExecutiveCopy;
};

export function ExecutivePagination({
  page,
  totalPages,
  total,
  oferta,
  city,
  propertyType,
  bedrooms,
  locale,
  defaultLocale,
  copy,
}: Props) {
  if (total <= 0 || totalPages <= 1) return null;

  const hrefFor = (target: number) =>
    localizedHref(
      "/",
      locale,
      catalogSearchParams({
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
    <nav className="executive-pagination" aria-label={copy.paginationAria}>
      <div className="executive-pagination__mobile">
        {canPrev ? (
          <Link href={hrefFor(page - 1)} className="executive-page-btn">
            {copy.paginationPrev}
          </Link>
        ) : (
          <span className="executive-page-btn is-disabled" aria-disabled="true">
            {copy.paginationPrev}
          </span>
        )}
        <p className="executive-pagination__status">
          {fillTemplate(copy.paginationPageOf, {
            current: page,
            total: totalPages,
          })}
        </p>
        {canNext ? (
          <Link href={hrefFor(page + 1)} className="executive-page-btn">
            {copy.paginationNext}
          </Link>
        ) : (
          <span className="executive-page-btn is-disabled" aria-disabled="true">
            {copy.paginationNext}
          </span>
        )}
      </div>

      <div className="executive-pagination__desktop">
        {canPrev ? (
          <Link href={hrefFor(page - 1)} className="executive-page-btn">
            {copy.paginationPrev}
          </Link>
        ) : (
          <span className="executive-page-btn is-disabled" aria-disabled="true">
            {copy.paginationPrev}
          </span>
        )}
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`e-${index}`}
              className="executive-pagination__ellipsis"
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
                  ? "executive-page-btn is-active"
                  : "executive-page-btn"
              }
              aria-label={fillTemplate(copy.goToPage, { page: item })}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </Link>
          ),
        )}
        {canNext ? (
          <Link href={hrefFor(page + 1)} className="executive-page-btn">
            {copy.paginationNext}
          </Link>
        ) : (
          <span className="executive-page-btn is-disabled" aria-disabled="true">
            {copy.paginationNext}
          </span>
        )}
      </div>
    </nav>
  );
}
