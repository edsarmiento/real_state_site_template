import type { Metadata } from "next";
import { publicApiFetch } from "@/lib/public-api-fetch";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import { getSessionContext } from "@/lib/session-context";
import {
  parseCatalogOfferFilter,
  type CatalogOfferFilter,
  type PublicListingCard as PublicListingCardType,
} from "@/lib/listing-types";
import { propertyTypeLabel } from "@/lib/property-labels";
import type { PropertyType } from "@/lib/property-types";
import { getPublicSiteContent } from "@/lib/public-site-content";
import { getDictionary, resolveRequestLocale } from "@/lib/site-i18n";
import {
  resolveSiteThemeFromConfig,
  themeNameFromLayoutKey,
} from "@/themes/resolve-site-theme";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function param(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

function resultsHeading(
  oferta: CatalogOfferFilter,
  city: string,
  total: number,
): string {
  const count = total === 1 ? "1 inmueble" : `${total} inmuebles`;
  const kind =
    oferta === "sale"
      ? "en venta"
      : oferta === "rent"
        ? "en renta"
        : "disponibles";
  const place = city ? ` en ${city}` : "";
  return `${count} ${kind}${place}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const oferta = parseCatalogOfferFilter(param(sp.oferta));
  const config = await getResolvedSiteConfig();
  const themeName = themeNameFromLayoutKey(config.layoutKey);

  if (themeName === "luxury") {
    const content = await getPublicSiteContent();
    const locale = resolveRequestLocale(param(sp.lang), content.locale);
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
      ...(oferta === "all" && !param(sp.city)
        ? { alternates: { canonical: "/" } }
        : {}),
    };
  }

  if (oferta === "sale") {
    return {
      title: "Inmuebles en venta",
      description: `${config.siteName} · venta`,
    };
  }
  if (oferta === "rent") {
    return {
      title: "Inmuebles en renta",
      description: `${config.siteName} · rentas`,
    };
  }
  return {
    title: "Buscar inmuebles",
    description: config.siteTagline,
  };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const theme = await resolveSiteThemeFromConfig();
  const city = param(sp.city).trim();
  const oferta = parseCatalogOfferFilter(param(sp.oferta));
  const propertyType = param(sp.tipo).trim();
  const bedrooms = param(sp.recamaras).trim();

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

  const emptyKind =
    oferta === "sale" ? "en venta" : oferta === "rent" ? " en renta" : "";
  const typeLabel = propertyType
    ? (propertyTypeLabel[propertyType as PropertyType] ?? propertyType)
    : null;

  const session = await getSessionContext();
  const Catalog = theme.Catalog;

  return (
    <Catalog
      oferta={oferta}
      city={city}
      propertyType={propertyType}
      bedrooms={bedrooms}
      listings={listings}
      total={total}
      heading={resultsHeading(oferta, city, total)}
      emptyKind={emptyKind}
      typeLabel={typeLabel}
      catalogOk={result.ok}
      catalogStatus={result.status}
      isAdmin={session?.isStaffUser === true}
      lang={param(sp.lang)}
    />
  );
}
