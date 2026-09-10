import Link from "next/link";
import { catalogTotalPages } from "@/lib/catalog-pagination";
import { locationsFromListings } from "@/lib/public-site-content";
import {
  fillTemplate,
  localizeSiteHref,
  localizedHref,
} from "@/lib/site-i18n";
import type { CatalogThemeProps } from "@/themes/theme-types";
import { UltraAbout } from "@/themes/ultra/ultra-about";
import { UltraCatalogGrid } from "@/themes/ultra/ultra-catalog-grid";
import { UltraCatalogSearch } from "@/themes/ultra/ultra-catalog-search";
import { UltraContact } from "@/themes/ultra/ultra-contact";
import { getUltraCopy } from "@/themes/ultra/ultra-copy";
import { UltraFinalCta } from "@/themes/ultra/ultra-final-cta";
import { UltraFooter } from "@/themes/ultra/ultra-footer";
import { UltraHeader } from "@/themes/ultra/ultra-header";
import { UltraHero } from "@/themes/ultra/ultra-hero";
import { fetchUnfilteredHeroPhotoUrls } from "@/themes/ultra/ultra-hero-catalog";
import {
  needsUnfilteredHeroCatalog,
  resolveHeroPhotoUrls,
} from "@/themes/ultra/ultra-hero-media";
import { UltraLocations } from "@/themes/ultra/ultra-locations";
import { UltraPagination } from "@/themes/ultra/ultra-pagination";
import { UltraProcess } from "@/themes/ultra/ultra-process";
import { UltraShell } from "@/themes/ultra/ultra-shell";
import { getUltraUi } from "@/themes/ultra/ultra-ui";

export async function UltraCatalog({
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
  const { dict, defaultLocale } = getUltraUi({ content, config, locale });
  const copy = getUltraCopy(locale);
  const locations =
    content.locations.length > 0
      ? content.locations
      : locationsFromListings(listings);
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const totalPages = catalogTotalPages(total, pageSize);
  const hasFieldFilters = Boolean(propertyType || bedrooms || city);
  const hasAnyFilter = hasFieldFilters || oferta !== "all";
  const localHeroUrls = resolveHeroPhotoUrls({
    configuredUrl: content.hero.imageUrl,
    galleryUrls: heroPhotoUrls,
    listings,
  });
  const catalogHeroUrls = needsUnfilteredHeroCatalog({
    hasAnyFilter,
    catalogOk,
    resolvedCount: localHeroUrls.length,
  })
    ? await fetchUnfilteredHeroPhotoUrls()
    : [];
  const heroUrls = resolveHeroPhotoUrls({
    configuredUrl: content.hero.imageUrl,
    galleryUrls: heroPhotoUrls,
    listings,
    catalogUrls: catalogHeroUrls,
  });
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
  const countLabel =
    total === 1
      ? dict.results.one
      : fillTemplate(dict.results.many, { count: total });

  return (
    <UltraShell lang={lang}>
      <UltraHeader lang={lang} />
      <UltraHero
        title={dict.hero.title}
        subtitle={dict.hero.subtitle}
        eyebrow={content.hero.eyebrow || content.brand.name}
        primaryHref={primaryHref}
        primaryLabel={dict.hero.primaryCta}
        secondaryHref={secondaryHref}
        secondaryLabel={dict.hero.secondaryCta}
        photoUrls={heroUrls}
        listings={listings}
        dict={dict}
        brandName={content.brand.name}
        fallbackLabel={copy.heroSelectedForYou}
      />

      <div className="ultra-search-shell">
        <div className="ultra-shell">
          <UltraCatalogSearch
            oferta={oferta}
            city={city}
            propertyType={propertyType}
            bedrooms={bedrooms}
            dict={dict}
            locale={locale}
            defaultLocale={defaultLocale}
          />
        </div>
      </div>

      <main id="catalogo" className="ultra-catalog" tabIndex={-1}>
        <div className="ultra-shell">
          {!catalogOk ? (
            <p className="ultra-lead">
              {fillTemplate(dict.results.catalogError, {
                status: catalogStatus,
              })}
            </p>
          ) : listings.length === 0 ? (
            <div className="ultra-state">
              <h2 className="ultra-section-title">
                {hasAnyFilter
                  ? copy.emptyFilterTitle
                  : dict.results.emptyTitle}
              </h2>
              <p className="ultra-lead">
                {hasAnyFilter
                  ? copy.emptyFilterCopy
                  : dict.results.emptyCopy}
                {emptyKind ? ` ${emptyKind}` : ""}
                {city ? ` ${fillTemplate(dict.results.inPlace, { city })}` : ""}
                {localizedType ? ` · ${localizedType}` : ""}
                {bedrooms
                  ? ` · ${fillTemplate(dict.results.bedroomsFilter, { count: bedrooms })}`
                  : ""}
                {hasAnyFilter ? "" : "."}
              </p>
              {hasAnyFilter ? (
                <Link href={homeHref} className="ultra-btn">
                  {dict.results.clearFilters}
                </Link>
              ) : null}
            </div>
          ) : (
            <section>
              <div className="ultra-catalog__head">
                <div>
                  <p className="ultra-eyebrow">
                    {dict.results.kicker}
                    {catalogOk ? ` · ${countLabel}` : ""}
                  </p>
                  <h2 className="ultra-section-title">{heading}</h2>
                </div>
                {hasAnyFilter ? (
                  <Link href={homeHref} className="ultra-inline-link">
                    {dict.results.clearFilters}
                  </Link>
                ) : null}
              </div>
              <UltraCatalogGrid
                listings={listings}
                dict={dict}
                locale={locale}
                defaultLocale={defaultLocale}
              />
              <UltraPagination
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

      <UltraLocations
        locations={locations}
        listings={listings}
        locale={locale}
        defaultLocale={defaultLocale}
        dict={dict}
      />
      <UltraAbout
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
        coverUrl={listings.find((item) => item.photo_url)?.photo_url}
      />
      <UltraProcess dict={dict} />
      <UltraContact
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />
      <UltraFinalCta content={content} dict={dict} />
      <UltraFooter lang={lang} />
    </UltraShell>
  );
}
