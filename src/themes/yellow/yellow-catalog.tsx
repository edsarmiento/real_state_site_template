import Link from "next/link";
import { catalogTotalPages } from "@/lib/catalog-pagination";
import type { PublicListingCard } from "@/lib/listing-types";
import {
  fillTemplate,
  localizeSiteHref,
  localizedHref,
} from "@/lib/site-i18n";
import type { CatalogThemeProps } from "@/themes/theme-types";
import { getYellowCopy } from "@/themes/yellow/yellow-copy";
import { displayListingTitle } from "@/themes/yellow/yellow-display";
import { YellowFooter } from "@/themes/yellow/yellow-footer";
import { YellowHeader } from "@/themes/yellow/yellow-header";
import { YellowHeroCollage } from "@/themes/yellow/yellow-hero-collage";
import { yellowHeroTitleParts } from "@/themes/yellow/yellow-hero-title";
import {
  resolveYellowHeroUrls,
  yellowSafeListingArray,
} from "@/themes/yellow/yellow-hero-urls";
import { YellowIconStar } from "@/themes/yellow/yellow-icons";
import { YellowListingCard } from "@/themes/yellow/yellow-listing-card";
import { yellowUniqueCities } from "@/themes/yellow/yellow-locations";
import { YellowPagination } from "@/themes/yellow/yellow-pagination";
import { YellowReveal } from "@/themes/yellow/yellow-reveal";
import { YellowSearch } from "@/themes/yellow/yellow-search";
import {
  YellowAbout,
  YellowContact,
  YellowLocations,
  YellowProcess,
} from "@/themes/yellow/yellow-sections";
import { YellowShell } from "@/themes/yellow/yellow-shell";
import { getYellowUi } from "@/themes/yellow/yellow-ui";

export async function YellowCatalog({
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
  const { content, dict, locale, defaultLocale } = await getYellowUi(lang);
  const copy = getYellowCopy(locale);
  const listingCards = yellowSafeListingArray<PublicListingCard>(listings);
  const collage = resolveYellowHeroUrls(
    content.hero.imageUrl,
    heroPhotoUrls,
    listingCards.map((item) => item.photo_url),
  );
  const locations = content.locations;
  const cityOptions = yellowUniqueCities(
    [
      ...locations.map((location) => ({
        city: location.filter.city ?? location.name,
        photo_url: location.imageUrl ?? null,
      })),
      ...listingCards,
    ],
    city,
  );
  const homeHref = localizedHref("/", locale, null, defaultLocale);
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
  const primaryHref = content.hero.primaryCta
    ? localizeSiteHref(content.hero.primaryCta.href, locale, defaultLocale)
    : localizedHref("/#propiedades", locale, null, defaultLocale);
  const secondaryHref = localizedHref(
    "/#sobre-nosotros",
    locale,
    null,
    defaultLocale,
  );
  const heroTitle = yellowHeroTitleParts(dict.hero.title);
  const countLabel =
    total === 1
      ? dict.results.one
      : fillTemplate(dict.results.many, { count: total });

  return (
    <YellowShell lang={lang}>
      <YellowHeader lang={lang} />

      <section className="yellow-hero">
        <div className="yellow-hero__atmosphere" aria-hidden>
          <span className="yellow-hero__glow yellow-hero__glow--sun" />
          <span className="yellow-hero__glow yellow-hero__glow--sky" />
          <span className="yellow-hero__lines" />
          <span className="yellow-hero__grain" />
        </div>
        <div className="yellow-shell yellow-hero__inner">
          <div className="yellow-hero__grid">
            <YellowReveal variant="up" className="yellow-hero__copy">
              <p className="yellow-hero__badge">
                <YellowIconStar className="yellow-hero__badge-icon" />
                <span>{content.hero.eyebrow || dict.hero.badge}</span>
              </p>
              <h1 className="yellow-hero__title">
                {heroTitle.lead ? `${heroTitle.lead} ` : null}
                <em className="yellow-hero__accent">{heroTitle.accent}</em>
              </h1>
              <p className="yellow-hero__subtitle">{dict.hero.subtitle}</p>
              <div className="yellow-hero__actions">
                <Link href={primaryHref} className="yellow-btn">
                  {dict.hero.primaryCta}
                </Link>
                <Link href={secondaryHref} className="yellow-btn yellow-btn--ghost">
                  {dict.hero.secondaryCta}
                </Link>
              </div>
            </YellowReveal>
            <div className="yellow-hero__media">
              <YellowHeroCollage
                urls={collage}
                title={displayListingTitle(listingCards[0]?.title ?? "")}
                photoAltTemplate={dict.listing.gallery.photoAlt}
                selectedLabel={copy.selectedProperties}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="yellow-search-overlap">
        <div className="yellow-shell">
          <YellowReveal variant="up" delayMs={120}>
            <div className="yellow-search-shell">
              <YellowSearch
                oferta={oferta}
                city={city}
                propertyType={propertyType}
                bedrooms={bedrooms}
                cityOptions={cityOptions}
                locale={locale}
                defaultLocale={defaultLocale}
                dict={dict}
              />
            </div>
          </YellowReveal>
        </div>
      </section>

      <main id="propiedades" className="yellow-catalog" tabIndex={-1}>
        <div id="catalogo" className="yellow-shell">
          {!catalogOk ? (
            <p className="yellow-lead">
              {fillTemplate(dict.results.catalogError, {
                status: catalogStatus,
              })}
            </p>
          ) : listingCards.length === 0 ? (
            <YellowReveal variant="up">
              <div className="yellow-state">
                <h2 className="yellow-section__title">
                  {dict.results.emptyTitle}
                </h2>
                <p className="yellow-lead">
                  {dict.results.emptyCopy}
                  {emptyKind ? ` ${emptyKind}` : ""}
                  {city ? ` ${fillTemplate(dict.results.inPlace, { city })}` : ""}
                  {localizedType ? ` · ${localizedType}` : ""}
                  {bedrooms
                    ? ` · ${fillTemplate(dict.results.bedroomsFilter, { count: bedrooms })}`
                    : ""}
                  .
                </p>
                <Link href={homeHref} className="yellow-btn yellow-btn--gold">
                  {dict.results.viewAll}
                </Link>
              </div>
            </YellowReveal>
          ) : (
            <section>
              <div className="yellow-catalog__head">
                <div>
                  <span className="yellow-count-badge">{countLabel}</span>
                  <h2 className="yellow-section__title">{heading}</h2>
                </div>
              </div>
              <ul className="yellow-grid">
                {listingCards.map((listing, index) => (
                  <li key={listing.slug}>
                    <YellowListingCard
                      listing={listing}
                      locale={locale}
                      defaultLocale={defaultLocale}
                      dict={dict}
                      index={index}
                    />
                  </li>
                ))}
              </ul>
              <YellowPagination
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

      <YellowLocations
        locations={locations}
        listings={listingCards}
        locale={locale}
        defaultLocale={defaultLocale}
        dict={dict}
      />
      <YellowAbout
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />
      <YellowProcess dict={dict} />
      <YellowContact
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />

      <section className="yellow-admin-bar" aria-label={dict.admin.catalogPrompt}>
        <div className="yellow-shell yellow-admin-bar__inner">
          <p>
            <strong>{dict.admin.catalogPrompt}</strong>{" "}
            {dict.admin.catalogPromptAction}
          </p>
          <Link href="/login" className="yellow-btn yellow-btn--ghost">
            {dict.admin.manage}
          </Link>
        </div>
      </section>

      <YellowFooter lang={lang} />
    </YellowShell>
  );
}
