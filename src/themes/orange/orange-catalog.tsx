import { locationsFromListings } from "@/lib/public-site-content";
import { resolveHeroPhotoUrls, needsUnfilteredHeroCatalog } from "@/lib/public-hero-media";
import { fetchUnfilteredHeroPhotoUrls } from "@/lib/public-hero-catalog";
import { OrangeHeroCollage } from "@/themes/orange/orange-hero-collage";
import Link from "next/link";
import { fillTemplate, localizeSiteHref, localizedHref } from "@/lib/site-i18n";
import type { CatalogThemeProps } from "@/themes/theme-types";
import { OrangeFooter } from "@/themes/orange/orange-footer";
import { OrangeHeader } from "@/themes/orange/orange-header";
import { OrangeListingCard } from "@/themes/orange/orange-listing-card";
import { OrangePagination } from "@/themes/orange/orange-pagination";
import { OrangeReveal } from "@/themes/orange/orange-reveal";
import { OrangeSearch } from "@/themes/orange/orange-search";
import {
  OrangeAbout,
  OrangeContact,
  OrangeLocations,
  OrangeProcess,
} from "@/themes/orange/orange-sections";
import { OrangeShell } from "@/themes/orange/orange-shell";
import { orangeHeroTitleParts } from "@/themes/orange/orange-hero-title";
import { getOrangeUi } from "@/themes/orange/orange-ui";

export async function OrangeCatalog({
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
  heading,
  typeLabel,
  content,
  config,
  locale,
}: CatalogThemeProps) {
  const { dict, copy, defaultLocale } = getOrangeUi({ content, config, locale });
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const clearHref = localizedHref(
    "/#catalogo",
    locale,
    oferta === "all"
      ? null
      : { oferta: oferta === "sale" ? "venta" : "renta" },
    defaultLocale,
  );
  const propertiesHref = content.hero.primaryCta
    ? localizeSiteHref(content.hero.primaryCta.href, locale, defaultLocale)
    : localizedHref("/#catalogo", locale, null, defaultLocale);
  const aboutHref = content.hero.secondaryCta
    ? localizeSiteHref(content.hero.secondaryCta.href, locale, defaultLocale)
    : localizedHref("/#about", locale, null, defaultLocale);
  const hasFilters = Boolean(propertyType || bedrooms || city);
  const hasAnyFilter = hasFilters || oferta !== "all";
  const heroSources = { configuredUrl: content.hero.imageUrl, galleryUrls: heroPhotoUrls, listings };
  const resolved = resolveHeroPhotoUrls(heroSources);
  const catalogUrls = needsUnfilteredHeroCatalog({ hasAnyFilter, catalogOk, resolvedCount: resolved.length })
    ? await fetchUnfilteredHeroPhotoUrls() : [];
  const heroUrls = resolveHeroPhotoUrls({ ...heroSources, catalogUrls });
  const locations = content.locations.length ? content.locations : locationsFromListings(listings);
  const localizedType = dict.propertyTypes[propertyType as keyof typeof dict.propertyTypes] ?? typeLabel;
  const title = dict.hero.title;
  const heroTitle = orangeHeroTitleParts(title, copy.heroTitleAccent);
  const resultsLabel =
    total === 1
      ? copy.availableOne
      : fillTemplate(copy.availableMany, { count: total });
  const emptyKind =
    oferta === "sale"
      ? dict.results.emptySale
      : oferta === "rent"
        ? dict.results.emptyRent
        : "";

  return (
    <OrangeShell lang={lang}>
      <OrangeHeader lang={lang} />

      <section className="orange-hero">
        <div className="orange-hero__grid">
          <OrangeReveal variant="slow" className="orange-hero__reveal-copy">
            <div className="orange-hero__copy">
              {content.hero.eyebrow ? (
                <p className="orange-hero__eyebrow">{content.hero.eyebrow}</p>
              ) : null}
              <h1 className="orange-hero__title">
                {heroTitle.before}
                {heroTitle.accent ? <em>{heroTitle.accent}</em> : null}
                {heroTitle.after}
              </h1>
              <p className="orange-hero__lead">
                {dict.hero.subtitle}
              </p>
              <div className="orange-hero__actions">
                <Link href={propertiesHref} className="orange-btn orange-btn--dark">
                  {dict.hero.primaryCta}
                </Link>
                <Link href={aboutHref} className="orange-btn orange-btn--outline">
                  {dict.hero.secondaryCta}
                </Link>
              </div>
            </div>
          </OrangeReveal>

          <OrangeReveal variant="left" className="orange-hero__reveal-media">
            <OrangeHeroCollage
              urls={heroUrls}
              title={listings[0]?.title || content.brand.name}
              photoAltTemplate={dict.listing.gallery.photoAlt}
            />
          </OrangeReveal>
        </div>
        <div className="orange-search-shell">
          <OrangeSearch
            oferta={oferta}
            city={city}
            propertyType={propertyType}
            bedrooms={bedrooms}
            locale={locale}
            defaultLocale={defaultLocale}
            dict={dict}
            resultsLabel={resultsLabel}
          />
        </div>
      </section>

      <main id="catalogo" className="orange-catalog" tabIndex={-1}>
        <OrangeReveal>
          <div className="orange-section__intro">
            <span className="orange-kicker">{dict.results.kicker}</span>
            <h2 className="orange-section__title">{heading}</h2>
            {hasFilters ? <Link href={clearHref} className="orange-inline-link">{dict.results.clearFilters}</Link> : null}
          </div>
        </OrangeReveal>

        {!catalogOk ? (
          <p className="orange-state">
            {fillTemplate(dict.results.catalogError, { status: catalogStatus })}
          </p>
        ) : listings.length === 0 ? (
          <div className="orange-state orange-state--card">
            <h2>{dict.results.emptyTitle}</h2>
            <p>
              {dict.results.emptyCopy}
              {emptyKind ? ` ${emptyKind}` : ""}
              {city ? ` ${fillTemplate(dict.results.inPlace, { city })}` : ""}
              {localizedType ? ` · ${localizedType}` : ""}
              {bedrooms ? ` · ${fillTemplate(dict.results.bedroomsFilter, { count: bedrooms })}` : ""}.
            </p>
            <Link href={hasFilters ? clearHref : homeHref} className="orange-btn orange-btn--dark">
              {hasFilters ? dict.results.clearFilters : dict.results.viewAll}
            </Link>
          </div>
        ) : (
          <>
            <div className="orange-grid">
              {listings.map((listing, index) => (
                <OrangeReveal key={listing.slug} delayMs={(index % 3) * 100}>
                  <OrangeListingCard
                    listing={listing}
                    locale={locale}
                    defaultLocale={defaultLocale}
                    dict={dict}
                    shareLabel={copy.share}
                    shareCopied={copy.shareCopied}
                  />
                </OrangeReveal>
              ))}
            </div>
            <OrangePagination
              oferta={oferta}
              city={city}
              propertyType={propertyType}
              bedrooms={bedrooms}
              page={page}
              total={total}
              pageSize={pageSize}
              locale={locale}
              defaultLocale={defaultLocale}
              copy={copy}
              prevLabel={copy.paginationPrev}
              nextLabel={copy.paginationNext}
            />
          </>
        )}
      </main>

      <OrangeLocations locations={locations} listings={listings} locale={locale} defaultLocale={defaultLocale} dict={dict} />
      <OrangeAbout content={content} dict={dict} locale={locale} defaultLocale={defaultLocale} imageUrl={heroUrls[0]} />
      <OrangeProcess dict={dict} />
      <OrangeContact content={content} dict={dict} description={copy.contactUnifiedDescription} />
      <OrangeFooter lang={lang} />
    </OrangeShell>
  );
}
