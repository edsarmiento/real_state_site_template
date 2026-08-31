import Link from "next/link";
import type { Metadata } from "next";
import { PublicCatalogSearch } from "@/components/public-catalog-search";
import { PublicListingCard } from "@/components/public-listing-card";
import { CatalogHero } from "@/components/layouts/catalog-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  const config = await getResolvedSiteConfig();
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
    oferta === "sale" ? "en venta" : oferta === "rent" ? "en renta" : "";
  const typeLabel = propertyType
    ? (propertyTypeLabel[propertyType as PropertyType] ?? propertyType)
    : null;

  if (theme.name === "luxury") {
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

  const isDefaultLayout = config.layoutKey === "default";

  return (
    <div
      className={`relative min-h-screen ${isDefaultLayout ? "bg-zinc-50" : "bg-[#f3f6fb]"}`}
    >
      <SiteHeader />

      <CatalogHero
        layoutKey={config.layoutKey}
        siteName={config.siteName}
        siteTagline={config.siteTagline}
        siteLogoUrl={config.siteLogoUrl}
        primaryColor={config.primaryColor}
        showPoweredBy={config.showPoweredBy}
        search={
          <PublicCatalogSearch
            oferta={oferta}
            city={city}
            propertyType={propertyType}
            bedrooms={bedrooms}
            styledLayout={!isDefaultLayout}
          />
        }
      />

      <section
        className={`relative mx-auto max-w-7xl px-4 sm:px-6 ${isDefaultLayout ? "pt-6" : "-mt-6"}`}
      >
        <div
          className={`flex flex-col gap-4 rounded-2xl border bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
            isDefaultLayout ? "border-zinc-200" : "border-blue-100"
          }`}
        >
          <p className="text-sm text-zinc-700">
            <span className="font-semibold text-zinc-950">¿Administras anuncios?</span>{" "}
            Accede al panel.
          </p>
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Administrar
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-12">
        {!result.ok ? (
          <p className="text-sm text-zinc-600">
            No se pudo cargar el catálogo ({result.status}). Revisa{" "}
            <code className="text-xs">ACCOUNT_ID</code> y{" "}
            <code className="text-xs">API_URL</code>.
          </p>
        ) : listings.length === 0 ? (
          <div
            className={`rounded-2xl bg-white px-6 py-12 text-center ${
              isDefaultLayout ? "ring-1 ring-zinc-200" : "ring-1 ring-blue-950/10"
            }`}
          >
            <p className="text-lg font-semibold text-zinc-950">No encontramos inmuebles</p>
            <p className="mt-2 text-base text-zinc-600">
              No hay anuncios publicados{emptyKind ? ` ${emptyKind}` : ""}
              {city ? ` en «${city}»` : ""}
              {typeLabel ? ` · ${typeLabel}` : ""}
              {bedrooms ? ` · ${bedrooms}+ recámaras` : ""}.
            </p>
            <Link
              href="/"
              className={`mt-6 inline-flex rounded-xl px-5 py-2.5 text-sm font-semibold text-white ${
                isDefaultLayout
                  ? "bg-zinc-900 hover:bg-zinc-800"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              Ver todos
            </Link>
          </div>
        ) : (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Resultados
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                  {resultsHeading(oferta, city, total)}
                </h2>
              </div>
              {(propertyType || bedrooms || city) && (
                <Link
                  href={
                    oferta === "all"
                      ? "/"
                      : `/?oferta=${oferta === "sale" ? "venta" : "renta"}`
                  }
                  className={
                    isDefaultLayout
                      ? "text-sm font-semibold text-zinc-800 hover:underline"
                      : "text-sm font-semibold text-blue-700 hover:underline"
                  }
                >
                  Limpiar filtros
                </Link>
              )}
            </div>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing) => (
                <li key={listing.slug} className="min-w-0">
                  <PublicListingCard listing={listing} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
