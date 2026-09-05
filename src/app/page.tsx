import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { parseCatalogPage, resolveCatalogPage } from "@/lib/catalog-pagination";
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
import { getPublicSiteContent } from "@/lib/public-site-content";
import {
  getDictionary,
  fillTemplate,
  localizedHref,
  resolveRequestLocale,
} from "@/lib/site-i18n";
import { firstSearchParam } from "@/lib/search-params";
import { beigeCatalogSearchParams } from "@/themes/beige/beige-pagination";
import {
  resolveSiteThemeFromConfig,
  themeNameFromLayoutKey,
} from "@/themes/resolve-site-theme";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const DEFAULT_CATALOG_LIMIT = 24;
const BEIGE_CATALOG_LIMIT = 12;

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
  const themeName = themeNameFromLayoutKey(config.layoutKey);

  if (themeName === "luxury" || themeName === "beige") {
    const content = await getPublicSiteContent();
    const locale = resolveRequestLocale(firstSearchParam(sp.lang), content.locale);
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
      ...(oferta === "all" &&
      !firstSearchParam(sp.city) &&
      (themeName !== "beige" || page === 1)
        ? { alternates: { canonical: "/" } }
        : {}),
    };
  }

  const locale = resolveRequestLocale(firstSearchParam(sp.lang), config.locale);
  const dict = getDictionary(locale);
  const title =
    oferta === "sale"
      ? dict.seo.catalogSale
      : oferta === "rent"
        ? dict.seo.catalogRent
        : dict.seo.catalogAll;

  return {
    title,
    description: config.siteTagline,
  };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const config = await getResolvedSiteConfig();
  const theme = await resolveSiteThemeFromConfig();
  const city = firstSearchParam(sp.city).trim();
  const oferta = parseCatalogOfferFilter(firstSearchParam(sp.oferta));
  const propertyType = firstSearchParam(sp.tipo).trim();
  const bedrooms = firstSearchParam(sp.recamaras).trim();

  const isBeige = theme.name === "beige";
  const page = isBeige ? parseCatalogPage(firstSearchParam(sp.page)) : 1;
  const pageSize = isBeige ? BEIGE_CATALOG_LIMIT : DEFAULT_CATALOG_LIMIT;
  const offset = isBeige ? (page - 1) * pageSize : 0;

  const qs = new URLSearchParams();
  if (city) qs.set("city", city);
  if (oferta === "rent") qs.set("offer_type", "rent");
  if (oferta === "sale") qs.set("offer_type", "sale");
  if (propertyType) qs.set("property_type", propertyType);
  if (bedrooms) qs.set("bedrooms", bedrooms);
  qs.set("limit", String(pageSize));
  if (isBeige) qs.set("offset", String(offset));

  const result = await publicApiFetch<{
    listings: PublicListingCardType[];
    meta: { total?: number; limit?: number; offset?: number };
  }>(`/api/public/listings?${qs.toString()}`);

  const listings =
    result.ok && Array.isArray(result.data.listings)
      ? result.data.listings
      : [];
  const total = result.ok ? (result.data.meta?.total ?? listings.length) : 0;

  if (isBeige && result.ok) {
    const resolved = resolveCatalogPage(
      firstSearchParam(sp.page),
      total,
      pageSize,
    );
    if (resolved.outOfRange) {
      const locale = resolveRequestLocale(
        firstSearchParam(sp.lang),
        config.locale,
      );
      redirect(
        localizedHref(
          "/",
          locale,
          beigeCatalogSearchParams({
            oferta,
            city,
            propertyType,
            bedrooms,
            page: resolved.page,
          }),
          config.locale.defaultLocale,
        ) + "#catalogo",
      );
    }
  }

  let heroPhotoUrls: string[] | undefined;
  if (isBeige) {
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

  const typeLabel = propertyType
    ? (getDictionary(
        resolveRequestLocale(firstSearchParam(sp.lang), config.locale),
      ).propertyTypes[propertyType as PropertyType] ?? propertyType)
    : null;

  const session = await getSessionContext();
  const Catalog = theme.Catalog;
  const locale = resolveRequestLocale(firstSearchParam(sp.lang), config.locale);
  const dict = getDictionary(locale);

  return (
    <Catalog
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
      lang={firstSearchParam(sp.lang)}
      heroPhotoUrls={heroPhotoUrls}
    />
  );
}
