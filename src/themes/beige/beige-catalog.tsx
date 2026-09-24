import Link from "next/link";
import { fetchUnfilteredHeroPhotoUrls } from "@/lib/public-hero-catalog";
import { needsUnfilteredHeroCatalog, resolveHeroPhotoUrls } from "@/lib/public-hero-media";
import { catalogTotalPages } from "@/lib/catalog-pagination";
import { locationsFromListings } from "@/lib/public-site-content";
import {
  fillTemplate,
  localizeSiteHref,
  localizedHref,
} from "@/lib/site-i18n";
import type { CatalogThemeProps } from "@/themes/theme-types";
import { getBeigeCopy } from "@/themes/beige/beige-copy";
import { displayListingTitle } from "@/themes/beige/beige-display";
import { BeigeFooter } from "@/themes/beige/beige-footer";
import { BeigeHeader } from "@/themes/beige/beige-header";
import { BeigeHeroCollage } from "@/themes/beige/beige-hero-collage";
import { beigeHeroTitleParts } from "@/themes/beige/beige-hero-title";
import { BeigeListingCard } from "@/themes/beige/beige-listing-card";
import { BeigePagination } from "@/themes/beige/beige-pagination";
import { BeigeReveal } from "@/themes/beige/beige-reveal";
import { BeigeSearch } from "@/themes/beige/beige-search";
import {
  BeigeAbout,
  BeigeContact,
  BeigeLocations,
  BeigeProcess,
} from "@/themes/beige/beige-sections";
import { BeigeShell } from "@/themes/beige/beige-shell";
import { getBeigeUi } from "@/themes/beige/beige-ui";

export async function BeigeCatalog({
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
  const { dict, defaultLocale } = getBeigeUi({ content, config, locale });
  const collage = (heroPhotoUrls ?? []).slice(0, 3);
  const locations =
    content.locations.length > 0
      ? content.locations
      : locationsFromListings(listings);
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const clearHref = localizedHref(
    "/",
    locale,
    oferta === "all"
      ? null
      : { oferta: oferta === "sale" ? "venta" : "renta" },
    defaultLocale,
  );
  const totalPages = catalogTotalPages(total, pageSize);
  const hasFilters = Boolean(propertyType || bedrooms || city);
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
  const aboutImageUrl = resolveHeroPhotoUrls({ ...heroSources, catalogUrls })[0];
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
    ? localizeSiteHref(content.hero.primaryCta.href, locale, defaultLocale)
    : localizedHref("/#catalogo", locale, null, defaultLocale);
  const secondaryHref = content.hero.secondaryCta
    ? localizeSiteHref(content.hero.secondaryCta.href, locale, defaultLocale)
    : localizedHref("/#about", locale, null, defaultLocale);
  const heroTitle = beigeHeroTitleParts(dict.hero.title);
  const countLabel =
    total === 1
      ? dict.results.one
      : fillTemplate(dict.results.many, { count: total });

  return (
    <BeigeShell lang={lang}>
      <BeigeHeader lang={lang} />

      <section className="beige-hero">
        <div className="beige-shell">
          <div className="beige-hero__grid">
            <div className="beige-hero__copy">
              <div className="beige-hero__block beige-hero__block--1">
                <p className="beige-hero__badge">{content.hero.eyebrow}</p>
                <h1 className="beige-hero__title">
                  {heroTitle.lead ? `${heroTitle.lead} ` : null}
                  <em className="beige-hero__accent">{heroTitle.accent}</em>
                </h1>
              </div>
              <p className="beige-hero__block beige-hero__block--2 beige-hero__subtitle">
                {dict.hero.subtitle}
              </p>
              <div className="beige-hero__block beige-hero__block--3 beige-hero__actions">
                <Link href={primaryHref} className="beige-btn">
                  {dict.hero.primaryCta}
                </Link>
                <Link
                  href={secondaryHref}
                  className="beige-btn beige-btn--ghost"
                >
                  {dict.hero.secondaryCta}
                </Link>
              </div>
            </div>
            <div className="beige-hero__media">
              <BeigeHeroCollage
                urls={collage}
                title={displayListingTitle(listings[0]?.title ?? "")}
                photoAltTemplate={dict.listing.gallery.photoAlt}
              />
            </div>
          </div>

          <BeigeReveal variant="up" className="beige-search-shell">
            <BeigeSearch
              oferta={oferta}
              city={city}
              propertyType={propertyType}
              bedrooms={bedrooms}
              locale={locale}
              defaultLocale={defaultLocale}
              dict={dict}
            />
          </BeigeReveal>
        </div>
      </section>

      <main id="catalogo" className="beige-catalog" tabIndex={-1}>
        <div className="beige-shell">
          {!catalogOk ? (
            <p className="beige-lead">
              {fillTemplate(dict.results.catalogError, {
                status: catalogStatus,
              })}
            </p>
          ) : listings.length === 0 ? (
            <BeigeReveal variant="up">
              <div className="beige-state">
                <h2 className="beige-section__title">
                  {dict.results.emptyTitle}
                </h2>
                <p className="beige-lead">
                  {dict.results.emptyCopy}
                  {emptyKind ? ` ${emptyKind}` : ""}
                  {city ? ` ${fillTemplate(dict.results.inPlace, { city })}` : ""}
                  {localizedType ? ` · ${localizedType}` : ""}
                  {bedrooms
                    ? ` · ${fillTemplate(dict.results.bedroomsFilter, { count: bedrooms })}`
                    : ""}
                  .
                </p>
                <Link href={homeHref} className="beige-btn beige-state__cta">
                  {dict.results.viewAll}
                </Link>
              </div>
            </BeigeReveal>
          ) : (
            <section>
              <BeigeReveal variant="up">
                <div className="beige-catalog__head">
                  <div>
                    <div className="beige-catalog__meta">
                      <p className="beige-eyebrow">{dict.results.kicker}</p>
                      <p className="beige-catalog__count">{countLabel}</p>
                    </div>
                    <h2 className="beige-section__title">{heading}</h2>
                    <hr className="beige-rule" />
                  </div>
                  {hasFilters ? (
                    <Link href={clearHref} className="beige-inline-link">
                      {dict.results.clearFilters}
                    </Link>
                  ) : null}
                </div>
              </BeigeReveal>
              <ul className="beige-grid">
                {listings.map((listing, index) => (
                  <li key={listing.slug}>
                    <BeigeListingCard
                      listing={listing}
                      locale={locale}
                      defaultLocale={defaultLocale}
                      dict={dict}
                      index={index}
                    />
                  </li>
                ))}
              </ul>
              <BeigePagination
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

      <BeigeLocations
        locations={locations}
        listings={listings}
        locale={locale}
        defaultLocale={defaultLocale}
        dict={dict}
      />
      <BeigeAbout
        imageUrl={aboutImageUrl}
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />
      <BeigeProcess dict={dict} />
      <BeigeContact
        content={content}
        dict={dict}
        description={getBeigeCopy(locale).contactDescription}
      />
      <BeigeFooter lang={lang} />
    </BeigeShell>
  );
}
