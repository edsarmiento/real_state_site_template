import Link from "next/link";
import { CatalogHero } from "@/components/layouts/catalog-hero";
import { PublicCatalogSearch } from "@/components/public-catalog-search";
import { PublicListingCard } from "@/components/public-listing-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import type { CatalogThemeProps } from "@/themes/theme-types";

export async function DefaultCatalog({
  oferta,
  city,
  propertyType,
  bedrooms,
  listings,
  heading,
  emptyKind,
  typeLabel,
  catalogOk,
  catalogStatus,
}: CatalogThemeProps) {
  const config = await getResolvedSiteConfig();

  return (
    <div className="relative min-h-screen bg-zinc-50">
      <SiteHeader />

      <CatalogHero
        layoutKey="default"
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
            styledLayout={false}
          />
        }
      />

      <section className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-zinc-700">
            <span className="font-semibold text-zinc-950">¿Administras anuncios?</span>{" "}
            Accede al panel.
          </p>
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            Administrar
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-12">
        {!catalogOk ? (
          <p className="text-sm text-zinc-600">
            No se pudo cargar el catálogo ({catalogStatus}). Revisa la
            configuración del sitio.
          </p>
        ) : listings.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
            <p className="text-lg font-semibold text-zinc-950">No encontramos inmuebles</p>
            <p className="mt-2 text-base text-zinc-600">
              No hay anuncios publicados{emptyKind ? ` ${emptyKind}` : ""}
              {city ? ` en «${city}»` : ""}
              {typeLabel ? ` · ${typeLabel}` : ""}
              {bedrooms ? ` · ${bedrooms}+ recámaras` : ""}.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-lg border border-zinc-300 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
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
                  {heading}
                </h2>
              </div>
              {(propertyType || bedrooms || city) && (
                <Link
                  href={
                    oferta === "all"
                      ? "/"
                      : `/?oferta=${oferta === "sale" ? "venta" : "renta"}`
                  }
                  className="text-sm font-semibold text-zinc-800 hover:underline"
                >
                  Limpiar filtros
                </Link>
              )}
            </div>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing) => (
                <li key={listing.slug} className="min-w-0">
                  <PublicListingCard listing={listing} styledLayout={false} />
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
