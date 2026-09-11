import Link from "next/link";
import {
  catalogPageItems,
  catalogSearchParams,
} from "@/lib/catalog-pagination";
import { fillTemplate, localizedHref } from "@/lib/site-i18n";
import type { CatalogOfferFilter } from "@/lib/listing-types";
import type { SiteLocale } from "@/lib/site-i18n";
import { getDarkCopy } from "@/themes/dark/dark-copy";
import { DARK_CATALOG_HASH } from "@/themes/dark/dark-ui";

const CATALOG_HASH = DARK_CATALOG_HASH;

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

export function DarkPagination({
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

  const copy = getDarkCopy(locale);
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
    <nav className="dark-pagination" aria-label={copy.paginationAria}>
      <div className="dark-pagination__mobile">
        {canPrev ? (
          <Link
            href={hrefFor(page - 1)}
            className="dark-page-btn"
            aria-label={copy.paginationPrev}
          >
            {copy.paginationPrev}
          </Link>
        ) : (
          <span className="dark-page-btn is-disabled" aria-disabled="true">
            {copy.paginationPrev}
          </span>
        )}
        <p className="dark-pagination__status">
          {fillTemplate(copy.paginationPageOf, {
            current: page,
            total: totalPages,
          })}
        </p>
        {canNext ? (
          <Link
            href={hrefFor(page + 1)}
            className="dark-page-btn"
            aria-label={copy.paginationNext}
          >
            {copy.paginationNext}
          </Link>
        ) : (
          <span className="dark-page-btn is-disabled" aria-disabled="true">
            {copy.paginationNext}
          </span>
        )}
      </div>

      <div className="dark-pagination__desktop">
        {canPrev ? (
          <Link href={hrefFor(page - 1)} className="dark-page-btn">
            {copy.paginationPrev}
          </Link>
        ) : (
          <span className="dark-page-btn is-disabled" aria-disabled="true">
            {copy.paginationPrev}
          </span>
        )}
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`e-${index}`}
              className="dark-pagination__ellipsis"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={hrefFor(item)}
              className={item === page ? "dark-page-btn is-active" : "dark-page-btn"}
              aria-label={fillTemplate(copy.goToPage, { page: item })}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </Link>
          ),
        )}
        {canNext ? (
          <Link href={hrefFor(page + 1)} className="dark-page-btn">
            {copy.paginationNext}
          </Link>
        ) : (
          <span className="dark-page-btn is-disabled" aria-disabled="true">
            {copy.paginationNext}
          </span>
        )}
      </div>
    </nav>
  );
}
