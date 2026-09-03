import Link from "next/link";
import { locationsFromListings } from "@/lib/public-site-content";
import { fillTemplate, localizedHref } from "@/lib/site-i18n";
import type { CatalogThemeProps } from "@/themes/theme-types";
import { BeigeCoverImage } from "@/themes/beige/beige-cover-image";
import { BeigeFooter } from "@/themes/beige/beige-footer";
import { BeigeHeader } from "@/themes/beige/beige-header";
import { BeigeListingCard } from "@/themes/beige/beige-listing-card";
import { BeigeReveal } from "@/themes/beige/beige-reveal";
import { BeigeSearch } from "@/themes/beige/beige-search";
import {
  BeigeAbout,
  BeigeCommercial,
  BeigeContact,
  BeigeFaq,
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
  typeLabel,
  catalogOk,
  catalogStatus,
  lang,
}: CatalogThemeProps) {
  const { content, dict, locale, defaultLocale } = await getBeigeUi(lang);
  const heroImage = content.hero.imageUrl;
  const collagePhotos = listings
    .map((listing) => listing.photo_url)
    .filter((url): url is string => Boolean(url?.trim()))
    .slice(0, 4);
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
  const residential = listings.filter(
    (listing) =>
      listing.property_type === "house" ||
      listing.property_type === "apartment" ||
      listing.property_type === "land" ||
      listing.property_type === "other",
  );
  const gridListings = residential.length > 0 ? residential : listings;

  return (
    <BeigeShell lang={lang}>
      <BeigeHeader lang={lang} variant="home" />

      <section className="relative overflow-hidden bg-[#2D2A26] text-[#FBF9F5]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#C4D3A2]">
              {content.hero.eyebrow || dict.hero.badge}
            </p>
            <h1 className="beige-hero__title mt-4 text-4xl leading-tight md:text-6xl">
              {dict.hero.titleBefore}{" "}
              <em className="not-italic text-[#C4D3A2]">{dict.hero.titleAccent}</em>{" "}
              {dict.hero.titleAfter}
            </h1>
            <p className="mt-5 max-w-lg text-[#E5D9C5]">{dict.hero.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[heroImage, ...collagePhotos].filter(Boolean).slice(0, 4).map(
              (src, index) => (
                <div
                  key={`${src}-${index}`}
                  className={`overflow-hidden rounded-2xl bg-[#3a3530] ${
                    index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                  }`}
                >
                  <BeigeCoverImage
                    src={src}
                    alt=""
                    className="beige-img-zoom h-full w-full object-cover"
                    placeholderClassName="h-full min-h-[8rem] bg-[#3a3530]"
                    placeholder=""
                  />
                </div>
              ),
            )}
            {![heroImage, ...collagePhotos].some(Boolean) ? (
              <div className="col-span-2 aspect-[16/9] rounded-2xl bg-[#3a3530]" />
            ) : null}
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-12">
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

      <main id="residencial" className="py-16">
        <BeigeReveal>
          <div className="mx-auto max-w-6xl px-6">
            {!catalogOk ? (
              <p className="text-[#8A7759]">
                {fillTemplate(dict.results.catalogError, {
                  status: catalogStatus,
                })}
              </p>
            ) : listings.length === 0 ? (
              <div className="rounded-2xl border border-[#E5D9C5] bg-[#F4EFE6] p-10 text-center">
                <p className="text-xl">{dict.results.emptyTitle}</p>
                <p className="mt-2 text-sm text-[#8A7759]">
                  {dict.results.emptyCopy}
                  {emptyKind ? ` ${emptyKind}` : ""}
                  {city
                    ? ` ${fillTemplate(dict.results.inPlace, { city })}`
                    : ""}
                  {localizedType ? ` · ${localizedType}` : ""}
                  {bedrooms
                    ? ` · ${fillTemplate(dict.results.bedroomsFilter, { count: bedrooms })}`
                    : ""}
                  .
                </p>
                <Link
                  href={homeHref}
                  className="mt-6 inline-flex rounded-full bg-[#A4B494] px-5 py-3 text-sm font-semibold text-[#2D2A26]"
                >
                  {dict.results.viewAll}
                </Link>
              </div>
            ) : (
              <section>
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#A39073]">
                      {dict.nav.residential}
                    </p>
                    <h2 className="beige-section__title mt-2 text-3xl">
                      {catalogHeading(dict, oferta, city, total)}
                    </h2>
                  </div>
                  {propertyType || bedrooms || city ? (
                    <Link
                      href={clearHref}
                      className="text-sm text-[#8A7759] underline-offset-4 hover:underline"
                    >
                      {dict.results.clearFilters}
                    </Link>
                  ) : null}
                </div>
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {gridListings.map((listing) => (
                    <li key={listing.slug}>
                      <BeigeListingCard
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
          </div>
        </BeigeReveal>
      </main>

      <BeigeLocations
        locations={locations}
        listings={listings}
        locale={locale}
        defaultLocale={defaultLocale}
        dict={dict}
      />
      <BeigeCommercial
        listings={listings}
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />
      <BeigeAbout
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />
      <BeigeTestimonials content={content} dict={dict} locale={locale} />
      <BeigeProcess dict={dict} />
      <BeigeFaq dict={dict} />
      <BeigeContact
        content={content}
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />
      <BeigeFooter lang={lang} />
    </BeigeShell>
  );
}
