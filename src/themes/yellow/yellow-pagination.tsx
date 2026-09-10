import Link from "next/link";
import {
  catalogPageItems,
  catalogSearchParams,
} from "@/lib/catalog-pagination";
import { fillTemplate, localizedHref } from "@/lib/site-i18n";
import type { CatalogOfferFilter } from "@/lib/listing-types";
import type { SiteLocale } from "@/lib/site-i18n";
import { getYellowCopy } from "@/themes/yellow/yellow-copy";

const CATALOG_HASH = "#catalogo";

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

export function YellowPagination({
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

  const copy = getYellowCopy(locale);
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
    <nav className="yellow-pagination" aria-label={copy.paginationAria}>
      <div className="yellow-pagination__mobile">
        {canPrev ? (
          <Link
            href={hrefFor(page - 1)}
            className="yellow-page-btn"
            aria-label={copy.paginationPrev}
          >
            {copy.paginationPrev}
          </Link>
        ) : (
          <span className="yellow-page-btn is-disabled" aria-disabled="true">
            {copy.paginationPrev}
          </span>
        )}
        <p className="yellow-pagination__status">
          {fillTemplate(copy.paginationPageOf, {
            current: page,
            total: totalPages,
          })}
        </p>
        {canNext ? (
          <Link
            href={hrefFor(page + 1)}
            className="yellow-page-btn"
            aria-label={copy.paginationNext}
          >
            {copy.paginationNext}
          </Link>
        ) : (
          <span className="yellow-page-btn is-disabled" aria-disabled="true">
            {copy.paginationNext}
          </span>
        )}
      </div>

      <div className="yellow-pagination__desktop">
        {canPrev ? (
          <Link href={hrefFor(page - 1)} className="yellow-page-btn">
            {copy.paginationPrev}
          </Link>
        ) : (
          <span className="yellow-page-btn is-disabled" aria-disabled="true">
            {copy.paginationPrev}
          </span>
        )}
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`e-${index}`}
              className="yellow-pagination__ellipsis"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={hrefFor(item)}
              className={
                item === page ? "yellow-page-btn is-active" : "yellow-page-btn"
              }
              aria-label={fillTemplate(copy.goToPage, { page: item })}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </Link>
          ),
        )}
        {canNext ? (
          <Link href={hrefFor(page + 1)} className="yellow-page-btn">
            {copy.paginationNext}
          </Link>
        ) : (
          <span className="yellow-page-btn is-disabled" aria-disabled="true">
            {copy.paginationNext}
          </span>
        )}
      </div>
    </nav>
  );
}
