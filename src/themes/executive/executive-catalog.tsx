import Link from "next/link";
import { catalogTotalPages } from "@/lib/catalog-pagination";
import { locationsFromListings } from "@/lib/public-site-content";
import {
  fillTemplate,
  localizeSiteHref,
  localizedHref,
} from "@/lib/site-i18n";
import type { CatalogThemeProps } from "@/themes/theme-types";
import { ExecutiveFooter } from "@/themes/executive/executive-footer";
import { ExecutiveHeader } from "@/themes/executive/executive-header";
import { ExecutiveHero } from "@/themes/executive/executive-hero";
import { executiveHeroPhotoUrls } from "@/themes/executive/executive-hero-photos";
import { executiveHeroTitleParts } from "@/themes/executive/executive-hero-title";
import { ExecutiveListingCard } from "@/themes/executive/executive-listing-card";
import { ExecutivePagination } from "@/themes/executive/executive-pagination";
import {
  ExecutiveAbout,
  ExecutiveContact,
  ExecutiveLocations,
  ExecutiveProcess,
} from "@/themes/executive/executive-sections";
import { ExecutiveShell } from "@/themes/executive/executive-shell";
import {
  executiveBrandInitial,
  getExecutiveUi,
} from "@/themes/executive/executive-ui";

export function ExecutiveCatalog({
  oferta,
  city,
  propertyType,
  bedrooms,
  listings,
  total,
  page = 1,
  pageSize = 12,
  catalogOk,
  catalogStatus,
  lang,
  heroPhotoUrls,
  content,
  config,
  locale,
}: CatalogThemeProps) {
  const { dict, copy, defaultLocale } = getExecutiveUi({
    content,
    config,
    locale,
  });
  const locations =
    content.locations.length > 0
      ? content.locations
      : locationsFromListings(listings);
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const clearHref =
    localizedHref(
      "/",
      locale,
      oferta === "all"
        ? null
        : { oferta: oferta === "sale" ? "venta" : "renta" },
      defaultLocale,
    ) + "#propiedades";
  const totalPages = catalogTotalPages(total, pageSize);
  const hasFilters = Boolean(propertyType || bedrooms || city);
  const emptyKind =
    oferta === "sale"
      ? dict.results.emptySale
      : oferta === "rent"
        ? dict.results.emptyRent
        : "";
  const primaryHref = content.hero.primaryCta
    ? localizeSiteHref(content.hero.primaryCta.href, locale, defaultLocale)
    : localizedHref("/#propiedades", locale, null, defaultLocale);
  const secondaryHref = content.hero.secondaryCta
    ? localizeSiteHref(content.hero.secondaryCta.href, locale, defaultLocale)
    : localizedHref("/#sobre-nosotros", locale, null, defaultLocale);
  const heroTitle = content.hero.title?.trim() || dict.hero.title;
  const parts = executiveHeroTitleParts(heroTitle);
  const collage = executiveHeroPhotoUrls({
    configuredUrl: content.hero.imageUrl,
    galleryUrls: heroPhotoUrls,
    listingCoverUrls: listings.map((listing) => listing.photo_url),
  });
  const countLabel =
    total === 1
      ? dict.results.one
      : fillTemplate(dict.results.many, { count: total });

  return (
    <ExecutiveShell lang={lang}>
      <ExecutiveHeader lang={lang} />
      <main>
        <ExecutiveHero
          eyebrow={content.hero.eyebrow || dict.hero.badge}
          titleLead={parts.lead}
          titleAccent={parts.accent}
          subtitle={content.hero.subtitle || dict.hero.subtitle}
          primaryHref={primaryHref}
          primaryLabel={content.hero.primaryCta?.label || dict.hero.primaryCta}
          secondaryHref={secondaryHref}
          secondaryLabel={
            content.hero.secondaryCta?.label || dict.hero.secondaryCta
          }
          photoUrls={collage}
          photoTitle={listings[0]?.title ?? content.brand.name}
          photoAltTemplate={dict.listing.gallery.photoAlt}
          plaque={copy.selectedProperties}
          brandInitial={executiveBrandInitial(content.brand.name)}
          oferta={oferta}
          city={city}
          propertyType={propertyType}
          bedrooms={bedrooms}
          locale={locale}
          defaultLocale={defaultLocale}
          dict={dict}
          copy={copy}
        />

        <section id="propiedades" className="executive-catalog" tabIndex={-1}>
          <span id="catalogo" className="executive-sr-only" />
          <div className="executive-shell">
            <div className="executive-catalog__head">
              <span className="executive-count-badge">{countLabel}</span>
              <h2 className="executive-section__title">{copy.catalogTitle}</h2>
            </div>

            {!catalogOk ? (
              <p className="executive-state">
                {fillTemplate(dict.results.catalogError, { status: catalogStatus })}
              </p>
            ) : listings.length === 0 ? (
              <div className="executive-state executive-state--card">
                <h3>{dict.results.emptyTitle}</h3>
                <p>
                  {dict.results.emptyCopy}
                  {emptyKind ? ` ${emptyKind}` : ""}
                  {city ? ` ${fillTemplate(dict.results.inPlace, { city })}` : ""}
                  .
                </p>
                <Link
                  href={hasFilters ? clearHref : homeHref}
                  className="executive-btn"
                >
                  {hasFilters ? dict.results.clearFilters : dict.results.viewAll}
                </Link>
              </div>
            ) : (
              <>
                {hasFilters ? (
                  <Link href={clearHref} className="executive-inline-link">
                    {dict.results.clearFilters}
                  </Link>
                ) : null}
                <ul className="executive-grid">
                  {listings.map((listing) => (
                    <li key={listing.slug}>
                      <ExecutiveListingCard
                        listing={listing}
                        locale={locale}
                        defaultLocale={defaultLocale}
                        dict={dict}
                      />
                    </li>
                  ))}
                </ul>
                <ExecutivePagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  oferta={oferta}
                  city={city}
                  propertyType={propertyType}
                  bedrooms={bedrooms}
                  locale={locale}
                  defaultLocale={defaultLocale}
                  copy={copy}
                />
              </>
            )}
          </div>
        </section>

        <ExecutiveLocations
          locations={locations}
          listings={listings}
          locale={locale}
          defaultLocale={defaultLocale}
          dict={dict}
          copy={copy}
        />
        <ExecutiveAbout
          content={content}
          dict={dict}
          copy={copy}
          locale={locale}
          defaultLocale={defaultLocale}
          coverUrl={collage[0]}
        />
        <ExecutiveProcess dict={dict} />
        <ExecutiveContact
          content={content}
          dict={dict}
          copy={copy}
        />
      </main>
      <ExecutiveFooter lang={lang} />
    </ExecutiveShell>
  );
}
