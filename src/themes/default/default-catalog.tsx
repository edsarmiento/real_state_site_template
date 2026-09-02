import Link from "next/link";
import { CatalogHero } from "@/components/layouts/catalog-hero";
import { PublicCatalogSearch } from "@/components/public-catalog-search";
import { PublicListingCard } from "@/components/public-listing-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { fillTemplate, localizedHref } from "@/lib/site-i18n";
import { getSiteUi } from "@/lib/site-ui";
import type { CatalogThemeProps } from "@/themes/theme-types";

export async function DefaultCatalog({
  oferta,
  city,
  propertyType,
  bedrooms,
  listings,
  heading,
  typeLabel,
  catalogOk,
  catalogStatus,
  lang,
}: CatalogThemeProps) {
  const ui = await getSiteUi(lang);
  const emptyKind =
    oferta === "sale"
      ? ui.dict.results.emptySale
      : oferta === "rent"
        ? ui.dict.results.emptyRent
        : "";
  const clearHref =
    oferta === "all"
      ? localizedHref("/", ui.locale, null, ui.defaultLocale)
      : localizedHref(
          `/?oferta=${oferta === "sale" ? "venta" : "renta"}`,
          ui.locale,
          null,
          ui.defaultLocale,
        );

  return (
    <div className="relative min-h-screen bg-zinc-50">
      <SiteHeader lang={lang} />

      <CatalogHero
        layoutKey="default"
        siteName={ui.config.siteName}
        siteTagline={ui.config.siteTagline}
        siteLogoUrl={ui.config.siteLogoUrl}
        primaryColor={ui.config.primaryColor}
        showPoweredBy={ui.config.showPoweredBy}
        search={
          <PublicCatalogSearch
            oferta={oferta}
            city={city}
            propertyType={propertyType}
            bedrooms={bedrooms}
            styledLayout={false}
            dict={ui.dict}
            locale={ui.locale}
            defaultLocale={ui.defaultLocale}
          />
        }
      />

      <section className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-zinc-700">
            <span className="font-semibold text-zinc-950">
              {ui.dict.admin.catalogPrompt}
            </span>{" "}
            {ui.dict.admin.catalogPromptAction}
          </p>
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            {ui.dict.admin.manage}
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-12">
        {!catalogOk ? (
          <p className="text-sm text-zinc-600">
            {fillTemplate(ui.dict.results.catalogError, { status: catalogStatus })}
          </p>
        ) : listings.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
            <p className="text-lg font-semibold text-zinc-950">
              {ui.dict.results.emptyTitle}
            </p>
            <p className="mt-2 text-base text-zinc-600">
              {ui.dict.results.emptyCopy}
              {emptyKind ? ` ${emptyKind}` : ""}
              {city
                ? ` ${fillTemplate(ui.dict.results.inPlace, { city: `«${city}»` })}`
                : ""}
              {typeLabel ? ` · ${typeLabel}` : ""}
              {bedrooms
                ? ` · ${fillTemplate(ui.dict.results.bedroomsFilter, { count: bedrooms })}`
                : ""}
              .
            </p>
            <Link
              href={localizedHref("/", ui.locale, null, ui.defaultLocale)}
              className="mt-6 inline-flex rounded-lg border border-zinc-300 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              {ui.dict.results.viewAll}
            </Link>
          </div>
        ) : (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  {ui.dict.results.kicker}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                  {heading}
                </h2>
              </div>
              {(propertyType || bedrooms || city) && (
                <Link
                  href={clearHref}
                  className="text-sm font-semibold text-zinc-800 hover:underline"
                >
                  {ui.dict.results.clearFilters}
                </Link>
              )}
            </div>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing) => (
                <li key={listing.slug} className="min-w-0">
                  <PublicListingCard
                    listing={listing}
                    styledLayout={false}
                    dict={ui.dict}
                    locale={ui.locale}
                    defaultLocale={ui.defaultLocale}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
