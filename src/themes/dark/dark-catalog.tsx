import Link from "next/link";
import { Suspense } from "react";
import { catalogSearchParams, catalogTotalPages } from "@/lib/catalog-pagination";
import {
  fillTemplate,
  localizedHref,
} from "@/lib/site-i18n";
import type { CatalogOfferFilter } from "@/lib/listing-types";
import type { CatalogThemeProps } from "@/themes/theme-types";
import { DarkCatalogHashScroll } from "@/themes/dark/dark-catalog-hash-scroll";
import { DarkFooter } from "@/themes/dark/dark-footer";
import { DarkHeader } from "@/themes/dark/dark-header";
import { resolveDarkHeroImage } from "@/themes/dark/dark-hero-media";
import { DarkHeroImage } from "@/themes/dark/dark-hero-image";
import { darkHeroTitleParts } from "@/themes/dark/dark-hero-title";
import { keepValidPublicListings } from "@/themes/dark/dark-listings";
import { resolveDarkLocations } from "@/themes/dark/dark-locations";
import { DarkListingCard } from "@/themes/dark/dark-listing-card";
import { DarkPagination } from "@/themes/dark/dark-pagination";
import { DarkReveal } from "@/themes/dark/dark-reveal";
import { DarkSearch } from "@/themes/dark/dark-search";
import {
  DarkAbout,
  DarkContact,
  DarkFinalCta,
  DarkLocations,
  DarkProcess,
  DarkTestimonials,
} from "@/themes/dark/dark-sections";
import { DarkShell } from "@/themes/dark/dark-shell";
import { DARK_CATALOG_HASH, getDarkUi } from "@/themes/dark/dark-ui";

function offerHref(
  target: CatalogOfferFilter,
  city: string,
  propertyType: string,
  bedrooms: string,
  locale: Parameters<typeof localizedHref>[1],
  defaultLocale: Parameters<typeof localizedHref>[3],
) {
  return (
    localizedHref(
      "/",
      locale,
      catalogSearchParams({
        oferta: target,
        city,
        propertyType,
        bedrooms,
      }),
      defaultLocale,
    ) + DARK_CATALOG_HASH
  );
}

export async function DarkCatalog({
  oferta,
  city,
  propertyType,
  bedrooms,
  listings,
  locationListings = [],
  total,
  page = 1,
  pageSize = 12,
  heading,
  typeLabel,
  catalogOk,
  catalogStatus,
  lang,
  heroPhotoUrls,
}: CatalogThemeProps) {
  const { content, dict, locale, defaultLocale } = await getDarkUi(lang);
  const validListings = keepValidPublicListings(listings);
  const locationSourceListings = keepValidPublicListings(locationListings);
  const { locations, inconsistencies } = resolveDarkLocations(
    content.locations,
    locationSourceListings,
  );
  if (inconsistencies.length > 0 && process.env.NODE_ENV !== "production") {
    for (const message of inconsistencies) {
      console.warn(`[dark-locations] ${message}`);
    }
  }
  const clearCatalogHref =
    localizedHref(
      "/",
      locale,
      catalogSearchParams({
        oferta: "all",
        city: "",
        propertyType: "",
        bedrooms: "",
      }),
      defaultLocale,
    ) + DARK_CATALOG_HASH;
  const totalPages = catalogTotalPages(total, pageSize);
  const emptyKind =
    oferta === "sale"
      ? dict.results.emptySale
      : oferta === "rent"
        ? dict.results.emptyRent
        : "";
  const localizedType =
    dict.propertyTypes[propertyType as keyof typeof dict.propertyTypes] ??
    typeLabel;
  const heroTitle = darkHeroTitleParts(dict.hero.title);
  const countLabel =
    total === 1
      ? dict.results.one
      : fillTemplate(dict.results.many, { count: total });
  const heroSrc = resolveDarkHeroImage({
    configuredUrl: content.hero.imageUrl,
    galleryUrls: heroPhotoUrls,
    listingPhotoUrl: validListings[0]?.photo_url,
  });

  const filters: { id: CatalogOfferFilter; label: string }[] = [
    { id: "all", label: dict.search.all },
    { id: "sale", label: dict.search.buy },
    { id: "rent", label: dict.search.rent },
  ];

  return (
    <DarkShell lang={lang}>
      <Suspense fallback={null}>
        <DarkCatalogHashScroll />
      </Suspense>
      <DarkHeader lang={lang} />

      <section className="dark-hero">
        <div className="dark-hero__media" aria-hidden={!heroSrc}>
          {heroSrc ? (
            <DarkHeroImage
              src={heroSrc}
              alt=""
              sizes="100vw"
              preload
              className="dark-hero__photo"
              placeholderClassName="dark-hero__fallback"
            />
          ) : (
            <div className="dark-hero__fallback" />
          )}
          <div className="dark-hero__scrim" />
          <div className="dark-hero__wash" />
        </div>
        <div className="dark-hero__content">
          <DarkReveal variant="up">
            <p className="dark-hero__badge">
              <span className="dark-hero__pulse" aria-hidden />
              {content.hero.eyebrow || dict.hero.badge}
            </p>
          </DarkReveal>
          <DarkReveal variant="up" delayMs={150}>
            <h1 className="dark-hero__title">
              {heroTitle.lead ? `${heroTitle.lead} ` : null}
              <em>{heroTitle.accent}</em>
            </h1>
          </DarkReveal>
          <DarkReveal variant="up" delayMs={300}>
            <p className="dark-hero__subtitle">{dict.hero.subtitle}</p>
          </DarkReveal>
          <DarkReveal variant="up" delayMs={450} className="dark-search-shell">
            <DarkSearch
              key={`${oferta}|${city}|${propertyType}|${bedrooms}|${locale}`}
              oferta={oferta}
              city={city}
              propertyType={propertyType}
              bedrooms={bedrooms}
              page={page}
              locale={locale}
              defaultLocale={defaultLocale}
              dict={dict}
            />
          </DarkReveal>
        </div>
      </section>

      <main id="propiedades" className="dark-catalog" tabIndex={-1}>
        <div className="dark-shell">
          {!catalogOk ? (
            <p className="dark-lead">
              {fillTemplate(dict.results.catalogError, {
                status: catalogStatus,
              })}
            </p>
          ) : validListings.length === 0 ? (
            <DarkReveal variant="up">
              <div className="dark-state">
                <h2
                  className="dark-section__title"
                  data-dark-catalog-heading
                >
                  {dict.results.emptyTitle}
                </h2>
                <p className="dark-lead">
                  {fillTemplate(dict.results.emptyFiltered, {
                    emptyKind: emptyKind ? ` ${emptyKind}` : "",
                    city: city ? ` ${fillTemplate(dict.results.inPlace, { city })}` : "",
                    localizedType: localizedType ? ` · ${localizedType}` : "",
                    bedrooms: bedrooms ? ` · ${fillTemplate(dict.results.bedroomsFilter, { count: bedrooms })}` : "",
                  })}
                </p>
                <Link href={clearCatalogHref} className="dark-btn" scroll={false}>
                  {dict.results.clearFilters}
                </Link>
              </div>
            </DarkReveal>
          ) : (
            <section>
              <DarkReveal variant="up">
                <div className="dark-catalog__head">
                  <div>
                    <p className="dark-eyebrow">{dict.results.kicker}</p>
                    <h2
                      className="dark-section__title"
                      data-dark-catalog-heading
                    >
                      {heading || countLabel}
                    </h2>
                  </div>
                  <div className="dark-catalog__filters">
                    {filters.map((filter) => (
                      <Link
                        key={filter.id}
                        href={offerHref(
                          filter.id,
                          city,
                          propertyType,
                          bedrooms,
                          locale,
                          defaultLocale,
                        )}
                        className={
                          oferta === filter.id
                            ? "dark-filter is-active"
                            : "dark-filter"
                        }
                        data-offer={filter.id}
                        aria-current={oferta === filter.id ? "page" : undefined}
                      >
                        {filter.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </DarkReveal>
              <ul className="dark-grid">
                {validListings.map((listing, index) => (
                  <li key={listing.slug}>
                    <DarkListingCard
                      listing={listing}
                      locale={locale}
                      defaultLocale={defaultLocale}
                      dict={dict}
                      index={index}
                    />
                  </li>
                ))}
              </ul>
              <DarkPagination
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
            </section>
          )}
        </div>
      </main>

      <DarkLocations
        locations={locations}
        listings={locationSourceListings}
        selectedCity={city}
        oferta={oferta}
        propertyType={propertyType}
        bedrooms={bedrooms}
        locale={locale}
        defaultLocale={defaultLocale}
        dict={dict}
      />
      <DarkAbout
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />
      <DarkProcess dict={dict} />
      <DarkTestimonials
        testimonials={content.testimonials}
        dict={dict}
        locale={locale}
      />
      <DarkContact
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />
      <DarkFinalCta content={content} dict={dict} />
      <DarkFooter lang={lang} />
    </DarkShell>
  );
}
