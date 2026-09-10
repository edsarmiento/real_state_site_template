import Link from "next/link";
import {
  locationsFromListings,
} from "@/lib/public-site-content";
import {
  fillTemplate,
  localizeSiteHref,
  localizedHref,
} from "@/lib/site-i18n";
import type { CatalogThemeRouteProps } from "@/themes/theme-types";
import { LuxuryButton } from "@/themes/luxury/luxury-button";
import { LuxuryFooter } from "@/themes/luxury/luxury-footer";
import { LuxuryHeader } from "@/themes/luxury/luxury-header";
import { LuxuryHeroMedia } from "@/themes/luxury/luxury-hero-media";
import { LuxuryListingCard } from "@/themes/luxury/luxury-listing-card";
import { LuxuryLocationsSection } from "@/themes/luxury/luxury-locations-section";
import { LuxurySearch } from "@/themes/luxury/luxury-search";
import {
  LuxuryAbout,
  LuxuryContact,
  LuxuryFinalCta,
  LuxuryProcess,
} from "@/themes/luxury/luxury-sections";
import { LuxuryTestimonials } from "@/themes/luxury/luxury-testimonials";
import { LuxuryReveal } from "@/themes/luxury/luxury-reveal";
import { LuxuryShell } from "@/themes/luxury/luxury-shell";
import { getLuxuryUi } from "@/themes/luxury/luxury-ui";

function catalogHeading(
  dict: Awaited<ReturnType<typeof getLuxuryUi>>["dict"],
  oferta: CatalogThemeRouteProps["oferta"],
  city: string,
  total: number,
): string {
  const count =
    total === 1
      ? dict.results.one
      : fillTemplate(dict.results.many, { count: total });
  const kind =
    oferta === "sale"
      ? dict.results.forSale
      : oferta === "rent"
        ? dict.results.forRent
        : dict.results.available;
  const place = city ? ` ${fillTemplate(dict.results.inPlace, { city })}` : "";
  return `${count} ${kind}${place}`;
}

export async function LuxuryCatalog({
  oferta,
  city,
  propertyType,
  bedrooms,
  listings,
  total,
  typeLabel,
  catalogOk,
  catalogStatus,
  lang,
}: CatalogThemeRouteProps) {
  const { content, dict, locale, defaultLocale } = await getLuxuryUi(lang);
  const heroImage = content.hero.imageUrl;
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
  const emptyKind =
    oferta === "sale"
      ? dict.results.emptySale
      : oferta === "rent"
        ? dict.results.emptyRent
        : "";
  const localizedType =
    dict.propertyTypes[propertyType as keyof typeof dict.propertyTypes] ??
    typeLabel;

  return (
    <LuxuryShell lang={lang}>
      <LuxuryHeader lang={lang} />

      <section className="luxury-hero">
        <LuxuryHeroMedia
          src={heroImage}
          position={content.hero.imagePosition}
        />
        <div className="luxury-hero__glow" aria-hidden />
        <div className="luxury-hero__content">
          <p className="luxury-eyebrow luxury-hero__eyebrow">
            {content.hero.eyebrow}
          </p>
          <h1 className="luxury-hero__title">{dict.hero.title}</h1>
          <p className="luxury-hero__tagline">{dict.hero.subtitle}</p>
          <div className="luxury-hero__actions">
            {content.hero.primaryCta ? (
              <LuxuryButton
                href={localizeSiteHref(
                  content.hero.primaryCta.href,
                  locale,
                  defaultLocale,
                )}
                variant="gold"
              >
                {dict.hero.primaryCta}
              </LuxuryButton>
            ) : null}
            {content.hero.secondaryCta ? (
              <LuxuryButton
                href={localizeSiteHref(
                  content.hero.secondaryCta.href,
                  locale,
                  defaultLocale,
                )}
                variant="ghost"
                surface="dark"
              >
                {dict.hero.secondaryCta}
              </LuxuryButton>
            ) : null}
          </div>
        </div>
        <div className="luxury-hero__search">
          <LuxurySearch
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

      <main id="catalogo" className="luxury-results">
        <LuxuryReveal>
          {!catalogOk ? (
            <p className="luxury-state luxury-state--error">
              {fillTemplate(dict.results.catalogError, {
                status: catalogStatus,
              })}
            </p>
          ) : listings.length === 0 ? (
            <div className="luxury-state">
              <p className="luxury-state__title">{dict.results.emptyTitle}</p>
              <p className="luxury-state__copy">
                {dict.results.emptyCopy}
                {emptyKind ? ` ${emptyKind}` : ""}
                {city ? ` ${fillTemplate(dict.results.inPlace, { city })}` : ""}
                {localizedType ? ` · ${localizedType}` : ""}
                {bedrooms
                  ? ` · ${fillTemplate(dict.results.bedroomsFilter, { count: bedrooms })}`
                  : ""}
                .
              </p>
              <LuxuryButton href={homeHref} variant="gold">
                {dict.results.viewAll}
              </LuxuryButton>
            </div>
          ) : (
            <section>
              <div className="luxury-results__head">
                <div>
                  <p className="luxury-results__kicker">{dict.results.kicker}</p>
                  <h2 className="luxury-results__heading">
                    {catalogHeading(dict, oferta, city, total)}
                  </h2>
                </div>
                {propertyType || bedrooms || city ? (
                  <Link href={clearHref} className="luxury-results__clear">
                    {dict.results.clearFilters}
                  </Link>
                ) : null}
              </div>

              <ul className="luxury-grid">
                {listings.map((listing) => (
                  <li key={listing.slug}>
                    <LuxuryListingCard
                      listing={listing}
                      locale={locale}
                      defaultLocale={defaultLocale}
                      dict={dict}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </LuxuryReveal>
      </main>

      <LuxuryLocationsSection
        locations={locations}
        listings={listings}
        locale={locale}
        defaultLocale={defaultLocale}
        dict={dict}
      />
      <LuxuryAbout content={content} dict={dict} locale={locale} defaultLocale={defaultLocale} />
      <LuxuryProcess dict={dict} />
      <LuxuryTestimonials
        testimonials={content.testimonials}
        locale={locale}
        dict={dict}
      />
      <LuxuryContact
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />
      <LuxuryFinalCta content={content} dict={dict} />
      <LuxuryFooter lang={lang} />
    </LuxuryShell>
  );
}