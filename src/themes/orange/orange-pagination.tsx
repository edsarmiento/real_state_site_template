import Link from "next/link";
import {
  catalogPageHref,
  catalogPageItems,
  getCatalogPagination,
  orangeCatalogSearchParams,
} from "@/lib/catalog-pagination";
import {
  catalogOfferQueryValue,
  type CatalogOfferFilter,
} from "@/lib/listing-types";
import { fillTemplate, localizedHref, type SiteLocale } from "@/lib/site-i18n";
import type { OrangeCopy } from "@/themes/orange/orange-copy";

type Props = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  page: number;
  total: number;
  pageSize: number;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  copy: OrangeCopy;
  prevLabel: string;
  nextLabel: string;
};

export function OrangePagination({
  oferta,
  city,
  propertyType,
  bedrooms,
  page,
  total,
  pageSize,
  locale,
  defaultLocale,
  copy,
  prevLabel,
  nextLabel,
}: Props) {
  const pagination = getCatalogPagination({ page, total, pageSize });
  const { totalPages } = pagination;
  if (totalPages <= 1) return null;
  const items = catalogPageItems(page, totalPages, 2);

  function hrefFor(next: number) {
    const baseHref = localizedHref(
      "/",
      locale,
      orangeCatalogSearchParams({
        oferta: catalogOfferQueryValue(oferta),
        city,
        propertyType,
        bedrooms,
      }),
      defaultLocale,
    );
    return catalogPageHref(baseHref, next);
  }

  return (
    <nav className="orange-pagination" aria-label={copy.paginationAria}>
      <div className="orange-pagination__mobile">
        {pagination.previousPage ? (
          <Link
            href={hrefFor(pagination.previousPage)}
            className="orange-page-btn"
            aria-label={copy.paginationPreviousAria}
          >
            {prevLabel}
          </Link>
        ) : (
          <span className="orange-page-btn is-disabled" aria-disabled="true">
            {prevLabel}
          </span>
        )}
        <span className="orange-pagination__status" aria-live="polite">
          {fillTemplate(copy.paginationPageOf, {
            page,
            total: totalPages,
          })}
        </span>
        {pagination.nextPage ? (
          <Link
            href={hrefFor(pagination.nextPage)}
            className="orange-page-btn"
            aria-label={copy.paginationNextAria}
          >
            {nextLabel}
          </Link>
        ) : (
          <span className="orange-page-btn is-disabled" aria-disabled="true">
            {nextLabel}
          </span>
        )}
      </div>
      <div className="orange-pagination__desktop">
        {pagination.previousPage ? (
          <Link
            href={hrefFor(pagination.previousPage)}
            className="orange-page-btn orange-page-btn--direction"
            aria-label={copy.paginationPreviousAria}
          >
            {prevLabel}
          </Link>
        ) : (
          <span
            className="orange-page-btn orange-page-btn--direction is-disabled"
            aria-disabled="true"
          >
            {prevLabel}
          </span>
        )}
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`e-${index}`}
              className="orange-page-ellipsis"
              aria-hidden="true"
            >
              …
            </span>
          ) : item === page ? (
            <span
              key={item}
              className="orange-page-btn is-active"
              aria-current="page"
              aria-label={fillTemplate(copy.paginationPageAria, { page: item })}
            >
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={hrefFor(item)}
              className="orange-page-btn"
              aria-label={fillTemplate(copy.paginationPageAria, { page: item })}
            >
              {item}
            </Link>
          ),
        )}
        {pagination.nextPage ? (
          <Link
            href={hrefFor(pagination.nextPage)}
            className="orange-page-btn orange-page-btn--direction"
            aria-label={copy.paginationNextAria}
          >
            {nextLabel}
          </Link>
        ) : (
          <span
            className="orange-page-btn orange-page-btn--direction is-disabled"
            aria-disabled="true"
          >
            {nextLabel}
          </span>
        )}
      </div>
    </nav>
  );
}
