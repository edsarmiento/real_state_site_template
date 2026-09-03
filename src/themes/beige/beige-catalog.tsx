import Link from "next/link";
import { catalogTotalPages } from "@/lib/catalog-pagination";
import { locationsFromListings } from "@/lib/public-site-content";
import { fillTemplate, localizedHref } from "@/lib/site-i18n";
import type { CatalogThemeProps } from "@/themes/theme-types";
import { beigeContactChannels } from "@/themes/beige/beige-contact-channels";
import { getBeigeCopy, resolveBeigeHeroCopy } from "@/themes/beige/beige-copy";
import { BeigeFooter } from "@/themes/beige/beige-footer";
import { BeigeHeader } from "@/themes/beige/beige-header";
import { BeigeHeroCollage } from "@/themes/beige/beige-hero-collage";
import { BeigeListingCard } from "@/themes/beige/beige-listing-card";
import { BeigePagination } from "@/themes/beige/beige-pagination";
import { BeigeReveal } from "@/themes/beige/beige-reveal";
import { BeigeSearch } from "@/themes/beige/beige-search";
import {
  BeigeAbout,
  BeigeContact,
  BeigeLocations,
  BeigeProcess,
  BeigeTestimonials,
} from "@/themes/beige/beige-sections";
import { BeigeShell } from "@/themes/beige/beige-shell";
import { getBeigeUi } from "@/themes/beige/beige-ui";

function catalogHeading(
  dict: Awaited<ReturnType<typeof getBeigeUi>>["dict"],
  oferta: CatalogThemeProps["oferta"],
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

export async function BeigeCatalog({
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
}: CatalogThemeProps) {
  const { content, dict, locale, defaultLocale } = await getBeigeUi(lang);
  const copy = getBeigeCopy(locale);
  const hero = resolveBeigeHeroCopy(content, locale);
  const heroImage = content.hero.imageUrl;
  const collagePhotos = listings
    .map((listing) => listing.photo_url)
    .filter((url): url is string => Boolean(url?.trim()))
    .slice(0, 3);
  const collage = [heroImage, ...collagePhotos]
    .filter((url): url is string => Boolean(url))
    .filter((url, index, all) => all.indexOf(url) === index)
    .slice(0, 3);
  const channels = beigeContactChannels(content);
  const whatsappHref = channels.whatsappHref;
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
  const availableLabel =
    total === 1
      ? copy.availableOne
      : fillTemplate(copy.availableMany, { count: total });
  const totalPages = catalogTotalPages(total, pageSize);
  const hasFilters = Boolean(
    propertyType || bedrooms || city || oferta !== "all",
  );

  return (
    <BeigeShell lang={lang}>
      <BeigeHeader lang={lang} variant="home" />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#FBF9F5] via-[#F4EFE6]/30 to-[#FBF9F5] pb-20 pt-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#8A7759_1px,transparent_1px)] [background-size:24px_24px]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 lg:flex-row">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center rounded-full border border-[#A4B494]/30 bg-[#A4B494]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#2D2A26]">
              {hero.heroEyebrow}
            </span>
            <h1 className="beige-hero__title text-4xl font-normal leading-tight tracking-tight text-[#2D2A26] sm:text-6xl">
              {hero.heroTitle.includes(hero.heroTitleAccent) ? (
                <>
                  {hero.heroTitle.slice(
                    0,
                    hero.heroTitle.indexOf(hero.heroTitleAccent),
                  )}
                  <em className="italic text-[#8F9F81]">
                    {hero.heroTitleAccent}
                  </em>
                  {hero.heroTitle.slice(
                    hero.heroTitle.indexOf(hero.heroTitleAccent) +
                      hero.heroTitleAccent.length,
                  )}
                </>
              ) : (
                hero.heroTitle
              )}
            </h1>
            <p className="text-base font-light leading-relaxed text-[#8A7759] sm:text-lg">
              {hero.heroSubtitle}
            </p>
          </div>
          <BeigeHeroCollage urls={collage} />
        </div>
        <div className="relative z-20 mx-auto mt-16 max-w-5xl px-6">
          <BeigeSearch
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

      <main id="propiedades" className="py-24" tabIndex={-1}>
        <BeigeReveal>
          <div className="mx-auto max-w-7xl px-6">
            {!catalogOk ? (
              <p className="text-[#8A7759]">
                {fillTemplate(dict.results.catalogError, {
                  status: catalogStatus,
                })}
              </p>
            ) : listings.length === 0 ? (
              <div className="rounded-2xl border border-[#E5D9C5] bg-[#F4EFE6] p-10 text-center">
                <h2
                  className="beige-section__title text-xl text-[#2D2A26] sm:text-3xl"
                  tabIndex={-1}
                >
                  {copy.catalogTitle}
                </h2>
                <p className="mt-3 text-sm text-[#8A7759]">
                  {hasFilters ? copy.emptyFilters : dict.results.emptyCopy}
                </p>
                <Link
                  href={homeHref}
                  className="mt-6 inline-flex rounded-full bg-[#A4B494] px-5 py-3 text-sm font-semibold text-[#2D2A26]"
                >
                  {copy.clearFilters}
                </Link>
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
              </div>
            ) : (
              <section>
                <div className="mb-16 flex flex-col justify-between md:flex-row md:items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A39073]">
                      {copy.catalogEyebrow}
                    </p>
                    <h2
                      className="beige-section__title mt-2 text-3xl text-[#2D2A26] sm:text-5xl"
                      tabIndex={-1}
                    >
                      {copy.catalogTitle}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm font-light text-[#8A7759]">
                      {copy.catalogDescription}
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#2D2A26]">
                      {availableLabel}
                      {city || oferta !== "all"
                        ? ` · ${catalogHeading(dict, oferta, city, total)}`
                        : ""}
                    </p>
                  </div>
                  {hasFilters ? (
                    <Link
                      href={clearHref}
                      className="mt-4 text-sm font-semibold text-[#2D2A26] transition-colors hover:text-[#A39073] md:mt-0"
                    >
                      {copy.clearFilters}
                    </Link>
                  ) : null}
                </div>
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {listings.map((listing) => (
                    <li key={listing.slug}>
                      <BeigeListingCard
                        listing={listing}
                        locale={locale}
                        defaultLocale={defaultLocale}
                        dict={dict}
                        whatsappHref={whatsappHref}
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
        </BeigeReveal>
      </main>

      <BeigeLocations
        locations={locations}
        listings={listings}
        locale={locale}
        defaultLocale={defaultLocale}
        copy={copy}
      />
      <BeigeAbout
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />
      <BeigeTestimonials content={content} dict={dict} locale={locale} />
      <BeigeProcess dict={dict} content={content} locale={locale} />
      <BeigeContact
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
        listingSlug={listings[0]?.slug ?? null}
      />
      <BeigeFooter lang={lang} />
    </BeigeShell>
  );
}
