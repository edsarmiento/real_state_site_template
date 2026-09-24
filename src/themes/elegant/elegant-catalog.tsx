import Link from "next/link";
import { fetchUnfilteredHeroPhotoUrls } from "@/lib/public-hero-catalog";
import { needsUnfilteredHeroCatalog, resolveHeroPhotoUrls } from "@/lib/public-hero-media";
import { PublicListingCard } from "@/components/public-listing-card";
import { catalogTotalPages } from "@/lib/catalog-pagination";
import { locationsFromListings } from "@/lib/public-site-content";
import {
  fillTemplate,
  localizeSiteHref,
  localizedHref,
} from "@/lib/site-i18n";
import type { CatalogThemeProps } from "@/themes/theme-types";
import { ElegantFooter } from "@/themes/elegant/elegant-footer";
import { ElegantHeader } from "@/themes/elegant/elegant-header";
import { elegantHeroTitleParts } from "@/themes/elegant/elegant-hero-title";
import { ElegantPagination } from "@/themes/elegant/elegant-pagination";
import { ElegantReveal } from "@/themes/elegant/elegant-reveal";
import { ElegantSearch } from "@/themes/elegant/elegant-search";
import {
  ElegantAbout,
  ElegantContact,
  ElegantLocations,
  ElegantProcess,
} from "@/themes/elegant/elegant-sections";
import { ElegantShell } from "@/themes/elegant/elegant-shell";
import { getElegantCopy } from "@/themes/elegant/elegant-copy";
import { elegantContentHref, getElegantUi } from "@/themes/elegant/elegant-ui";

export async function ElegantCatalog({
  oferta,
  city,
  propertyType,
  bedrooms,
  listings,
  total,
  page = 1,
  pageSize = 12,
  heading,
  typeLabel,
  catalogOk,
  catalogStatus,
  lang,
  heroPhotoUrls,
  content,
  config,
  locale,
}: CatalogThemeProps) {
  const { dict, defaultLocale } = getElegantUi({ content, config, locale });
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
  const localizedType =
    dict.propertyTypes[propertyType as keyof typeof dict.propertyTypes] ??
    typeLabel;
  const primaryHref = content.hero.primaryCta
    ? elegantContentHref(content.hero.primaryCta.href, locale, defaultLocale)
    : localizedHref("/#propiedades", locale, null, defaultLocale);
  const secondaryHref = content.hero.secondaryCta
    ? elegantContentHref(content.hero.secondaryCta.href, locale, defaultLocale)
    : localizeSiteHref("#sobre-nosotros", locale, defaultLocale);
  const heroTitle = content.hero.title?.trim() || dict.hero.title;
  const parts = elegantHeroTitleParts(heroTitle, dict.hero.titleAccent);
  const heroSources = {
    configuredUrl: content.hero.imageUrl,
    galleryUrls: heroPhotoUrls,
    listings,
  };
  const resolvedHeroUrls = resolveHeroPhotoUrls(heroSources);
  const catalogUrls = needsUnfilteredHeroCatalog({
    hasAnyFilter: hasFilters || oferta !== "all",
    catalogOk,
    resolvedCount: resolvedHeroUrls.length,
  })
    ? await fetchUnfilteredHeroPhotoUrls()
    : [];
  const heroImage = resolveHeroPhotoUrls({ ...heroSources, catalogUrls })[0] ?? "";
  const countLabel =
    total === 1
      ? dict.results.one
      : fillTemplate(dict.results.many, { count: total });

  return (
    <ElegantShell lang={lang}>
      <ElegantHeader lang={lang} />
      <main>
        <section className="elegant-hero">
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt=""
              className="elegant-hero__photo"
              aria-hidden
            />
          ) : null}
          <div className="elegant-hero__veil" aria-hidden />
          <div className="elegant-hero__copy">
            <span className="elegant-hero__badge">{content.brand.name}</span>
            <h1 className="elegant-hero__title">
              {parts.before}
              {parts.accent ? (
                <span className="elegant-hero__accent">{parts.accent}</span>
              ) : null}
              {parts.after}
            </h1>
            <p className="elegant-hero__lead">
              {content.hero.subtitle || dict.hero.subtitle}
            </p>
            <div className="elegant-hero__actions">
              <Link href={primaryHref} className="elegant-btn elegant-btn--gold">
                {dict.hero.primaryCta}
              </Link>
              <Link href={secondaryHref} className="elegant-btn elegant-btn--ghost">
                {dict.hero.secondaryCta}
              </Link>
            </div>
            <ElegantSearch
              oferta={oferta}
              city={city}
              propertyType={propertyType}
              bedrooms={bedrooms}
              locale={locale}
              defaultLocale={defaultLocale}
              dict={dict}
            />
          </div>
        </section>

        <section id="propiedades" className="elegant-catalog" tabIndex={-1}>
          <div className="elegant-shell">
            <div className="elegant-catalog__head">
              <div>
                <p className="elegant-kicker">{dict.results.kicker}</p>
                <h2 className="elegant-section__title">{heading}</h2>
              </div>
              <p className="elegant-muted">{countLabel}</p>
            </div>

            {!catalogOk ? (
              <p className="elegant-state">
                {fillTemplate(dict.results.catalogError, { status: catalogStatus })}
              </p>
            ) : listings.length === 0 ? (
              <div className="elegant-state elegant-state--card">
                <p className="elegant-state__title">{dict.results.emptyTitle}</p>
                <p>
                  {dict.results.emptyCopy}
                  {emptyKind ? ` ${emptyKind}` : ""}
                  {city ? ` ${fillTemplate(dict.results.inPlace, { city })}` : ""}
                  {localizedType ? ` · ${localizedType}` : ""}
                  {bedrooms
                    ? ` · ${fillTemplate(dict.results.bedroomsFilter, { count: bedrooms })}`
                    : ""}
                  .
                </p>
                <Link
                  href={hasFilters ? clearHref : homeHref}
                  className="elegant-btn elegant-btn--gold"
                >
                  {hasFilters ? dict.results.clearFilters : dict.results.viewAll}
                </Link>
              </div>
            ) : (
              <>
                {hasFilters ? (
                  <Link href={clearHref} className="elegant-inline-link">
                    {dict.results.clearFilters}
                  </Link>
                ) : null}
                <div className="elegant-grid">
                  {listings.map((listing, index) => (
                    <ElegantReveal key={listing.slug} delayMs={(index % 3) * 80}>
                      <PublicListingCard
                        listing={listing}
                        styledLayout={false}
                        dict={dict}
                        locale={locale}
                        defaultLocale={defaultLocale}
                        className="elegant-card"
                        ctaLabel={dict.listing.viewProperty}
                      />
                    </ElegantReveal>
                  ))}
                </div>
                <ElegantPagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  oferta={oferta}
                  city={city}
                  propertyType={propertyType}
                  bedrooms={bedrooms}
                  locale={locale}
                  defaultLocale={defaultLocale}
                />
              </>
            )}
          </div>
        </section>

        <ElegantLocations
          locations={locations}
          listings={listings}
          locale={locale}
          defaultLocale={defaultLocale}
          dict={dict}
        />
        <ElegantAbout
          imageUrl={heroImage}
          content={content}
          dict={dict}
          locale={locale}
          defaultLocale={defaultLocale}
        />
        <ElegantProcess dict={dict} />
        <ElegantContact
          content={content}
          dict={dict}
          description={getElegantCopy(locale).contactUnifiedDescription}
        />
      </main>
      <ElegantFooter lang={lang} />
    </ElegantShell>
  );
}
