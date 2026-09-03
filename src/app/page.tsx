import type { Metadata } from "next";
import { publicApiFetch } from "@/lib/public-api-fetch";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import { getSessionContext } from "@/lib/session-context";
import {
  parseCatalogOfferFilter,
  type CatalogOfferFilter,
  type PublicListingCard as PublicListingCardType,
} from "@/lib/listing-types";
import type { PropertyType } from "@/lib/property-types";
import { getPublicSiteContent } from "@/lib/public-site-content";
import { getDictionary, fillTemplate, resolveRequestLocale } from "@/lib/site-i18n";
import { firstSearchParam } from "@/lib/search-params";
import {
  resolveSiteThemeFromConfig,
  themeNameFromLayoutKey,
} from "@/themes/resolve-site-theme";

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
    return {
      title,
      description: config.siteTagline,
      ...(oferta === "all" && !firstSearchParam(sp.city)
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

  const qs = new URLSearchParams();
  if (city) qs.set("city", city);
  if (oferta === "rent") qs.set("offer_type", "rent");
  if (oferta === "sale") qs.set("offer_type", "sale");
  if (propertyType) qs.set("property_type", propertyType);
  if (bedrooms) qs.set("bedrooms", bedrooms);
  qs.set("limit", "24");

  const result = await publicApiFetch<{
    listings: PublicListingCardType[];
    meta: { total: number };
  }>(`/api/public/listings?${qs.toString()}`);

  const listings =
    result.ok && Array.isArray(result.data.listings)
      ? result.data.listings
      : [];
  const total = result.ok ? (result.data.meta?.total ?? listings.length) : 0;

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
      heading={resultsHeading(oferta, city, total, dict)}
      typeLabel={typeLabel}
      catalogOk={result.ok}
      catalogStatus={result.status}
      isAdmin={session?.isStaffUser === true}
      lang={firstSearchParam(sp.lang)}
    />
  );
}
