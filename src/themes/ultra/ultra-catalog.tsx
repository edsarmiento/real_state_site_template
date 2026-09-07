import Link from "next/link";
import { PublicCatalogSearch } from "@/components/public-catalog-search";
import { PublicListingCard } from "@/components/public-listing-card";
import { catalogTotalPages } from "@/lib/catalog-pagination";
import { locationsFromListings } from "@/lib/public-site-content";
import {
  fillTemplate,
  localizeSiteHref,
  localizedHref,
} from "@/lib/site-i18n";
import type { CatalogThemeProps } from "@/themes/theme-types";
import { UltraAbout } from "@/themes/ultra/ultra-about";
import { UltraContact } from "@/themes/ultra/ultra-contact";
import { UltraFinalCta } from "@/themes/ultra/ultra-final-cta";
import { UltraFooter } from "@/themes/ultra/ultra-footer";
import { UltraHeader } from "@/themes/ultra/ultra-header";
import { UltraHero } from "@/themes/ultra/ultra-hero";
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
}: CatalogThemeProps) {
  const { content, dict, locale, defaultLocale } = await getUltraUi(lang);
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
        photoUrls={heroPhotoUrls}
        listings={listings}
        dict={dict}
      />

      <div className="ultra-search-shell">
        <div className="ultra-shell">
          <PublicCatalogSearch
            oferta={oferta}
            city={city}
            propertyType={propertyType}
            bedrooms={bedrooms}
            styledLayout
            dict={dict}
            locale={locale}
            defaultLocale={defaultLocale}
            className="ultra-search"
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
              <h2 className="ultra-section-title">{dict.results.emptyTitle}</h2>
              <p className="ultra-lead">
                {dict.results.emptyCopy}
                {emptyKind ? ` ${emptyKind}` : ""}
                {city ? ` ${fillTemplate(dict.results.inPlace, { city })}` : ""}
                {localizedType ? ` · ${localizedType}` : ""}
                {bedrooms
                  ? ` · ${fillTemplate(dict.results.bedroomsFilter, { count: bedrooms })}`
                  : ""}
                .
              </p>
              <Link href={homeHref} className="ultra-btn">
                {dict.results.viewAll}
              </Link>
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
                {hasFilters ? (
                  <Link href={clearHref} className="ultra-inline-link">
                    {dict.results.clearFilters}
                  </Link>
                ) : null}
              </div>
              <ul className="ultra-grid">
                {listings.map((listing) => (
                  <li key={listing.slug} className="min-w-0">
                    <PublicListingCard
                      listing={listing}
                      styledLayout
                      dict={dict}
                      locale={locale}
                      defaultLocale={defaultLocale}
                      className="ultra-card"
                    />
                  </li>
                ))}
              </ul>
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
