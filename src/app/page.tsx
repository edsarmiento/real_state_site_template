import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  catalogSearchParams,
  parseCatalogPage,
  resolveCatalogPage,
} from "@/lib/catalog-pagination";
import { publicApiFetch } from "@/lib/public-api-fetch";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import { getSessionContext } from "@/lib/session-context";
import {
  listingGalleryUrls,
  parseCatalogOfferFilter,
  type CatalogOfferFilter,
  type PublicListingCard as PublicListingCardType,
  type PublicListingDetail,
} from "@/lib/listing-types";
import type { PropertyType } from "@/lib/property-types";
import {
  getDictionary,
  fillTemplate,
  localizedHref,
  resolveRequestLocale,
} from "@/lib/site-i18n";
import { firstSearchParam } from "@/lib/search-params";
import { resolveSiteThemeFromConfig } from "@/themes/resolve-site-theme";
import { resolveThemeProps } from "@/themes/resolve-theme-props";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function resultsHeading(
  oferta: CatalogOfferFilter,
  city: string,
  total: number,
  dict: ReturnType<typeof getDictionary>,
): string {
  const count =
    total === 1
      ? dict.results.one
      : fillTemplate(dict.results.many, { count: total });
  const kind =
    oferta === "sale"
      ? dict.results.forSale
      : oferta === "rent"
        ? dict.results.forRent
        : dict.results.available;
  const place = city
    ? fillTemplate(dict.results.inPlace, { city })
    : "";
  return `${count} ${kind}${place}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const oferta = parseCatalogOfferFilter(firstSearchParam(sp.oferta));
  const config = await getResolvedSiteConfig();
  const locale = resolveRequestLocale(firstSearchParam(sp.lang), config.locale);
  const dict = getDictionary(locale);
  const title =
    oferta === "sale"
      ? dict.seo.catalogSale
      : oferta === "rent"
        ? dict.seo.catalogRent
        : dict.seo.catalogAll;
  const page = parseCatalogPage(firstSearchParam(sp.page));

  return {
    title,
    description: config.siteTagline,
    ...(oferta === "all" && !firstSearchParam(sp.city) && page === 1
      ? { alternates: { canonical: "/" } }
      : {}),
  };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const lang = firstSearchParam(sp.lang);
  const themeProps = await resolveThemeProps(lang);
  const theme = await resolveSiteThemeFromConfig();
  const city = firstSearchParam(sp.city).trim();
  const oferta = parseCatalogOfferFilter(firstSearchParam(sp.oferta));
  const propertyType = firstSearchParam(sp.tipo).trim();
  const bedrooms = firstSearchParam(sp.recamaras).trim();

  const page = parseCatalogPage(firstSearchParam(sp.page));
  const pageSize = theme.catalog.pageSize;
  const offset = (page - 1) * pageSize;

  const qs = new URLSearchParams();
  if (city) qs.set("city", city);
  if (oferta === "rent") qs.set("offer_type", "rent");
  if (oferta === "sale") qs.set("offer_type", "sale");
  if (propertyType) qs.set("property_type", propertyType);
  if (bedrooms) qs.set("bedrooms", bedrooms);
  qs.set("limit", String(pageSize));
  qs.set("offset", String(offset));

  const result = await publicApiFetch<{
    listings: PublicListingCardType[];
    meta: { total?: number; limit?: number; offset?: number };
  }>(`/api/public/listings?${qs.toString()}`);

  const listings =
    result.ok && Array.isArray(result.data.listings)
      ? result.data.listings
      : [];
  const total = result.ok ? (result.data.meta?.total ?? listings.length) : 0;

  if (result.ok) {
    const resolved = resolveCatalogPage(
      firstSearchParam(sp.page),
      total,
      pageSize,
    );
    if (resolved.outOfRange) {
      redirect(
        localizedHref(
          "/",
          themeProps.locale,
          catalogSearchParams({
            oferta,
            city,
            propertyType,
            bedrooms,
            page: resolved.page,
          }),
          themeProps.config.locale.defaultLocale,
        ) + "#catalogo",
      );
    }
  }

  let heroPhotoUrls: string[] | undefined;
  if (theme.catalog.heroGallery) {
    const first = listings[0];
    if (!first?.slug) {
      heroPhotoUrls = [];
    } else {
      const detail = await publicApiFetch<PublicListingDetail>(
        `/api/public/listings/${encodeURIComponent(first.slug)}`,
      );
      heroPhotoUrls = (
        detail.ok
          ? listingGalleryUrls(detail.data)
          : listingGalleryUrls({ photo_url: first.photo_url })
      ).slice(0, 3);
    }
  }

  const dict = getDictionary(themeProps.locale);
  const typeLabel = propertyType
    ? (dict.propertyTypes[propertyType as PropertyType] ?? propertyType)
    : null;

  const session = await getSessionContext();
  const Catalog = theme.Catalog;

  return (
    <Catalog
      {...themeProps}
      oferta={oferta}
      city={city}
      propertyType={propertyType}
      bedrooms={bedrooms}
      listings={listings}
      total={total}
      page={page}
      pageSize={pageSize}
      heading={resultsHeading(oferta, city, total, dict)}
      typeLabel={typeLabel}
      catalogOk={result.ok}
      catalogStatus={result.status}
      isAdmin={session?.isStaffUser === true}
      lang={lang}
      heroPhotoUrls={heroPhotoUrls}
    />
  );
}
