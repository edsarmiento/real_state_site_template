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
    .slice(0, 3);
  const collage = [heroImage, ...collagePhotos]
    .filter((url): url is string => Boolean(url))
    .filter((url, index, all) => all.indexOf(url) === index)
    .slice(0, 3);
  const whatsappHref = content.whatsapp.href ?? content.contact.whatsappHref;
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

      <section className="relative overflow-hidden bg-gradient-to-b from-[#FBF9F5] via-[#F4EFE6]/30 to-[#FBF9F5] pb-20 pt-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#8A7759_1px,transparent_1px)] [background-size:24px_24px]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 lg:flex-row">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center rounded-full border border-[#A4B494]/30 bg-[#A4B494]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#2D2A26]">
              {content.hero.eyebrow || dict.hero.badge}
            </span>
            <h1 className="beige-hero__title text-4xl font-normal leading-tight tracking-tight text-[#2D2A26] sm:text-6xl">
              {dict.hero.titleBefore}{" "}
              <em className="italic text-[#8F9F81]">{dict.hero.titleAccent}</em>{" "}
              {dict.hero.titleAfter}
            </h1>
            <p className="text-base font-light leading-relaxed text-[#8A7759] sm:text-lg">
              {dict.hero.subtitle}
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-4 lg:w-1/2">
            <div className="col-span-2 overflow-hidden rounded-3xl border-2 border-white shadow-2xl">
              <BeigeCoverImage
                src={collage[0]}
                alt=""
                className="beige-img-zoom h-52 w-full object-cover md:h-64"
                placeholderClassName="h-52 bg-[#E5D9C5] md:h-64"
                placeholder=""
              />
            </div>
            <div className="overflow-hidden rounded-2xl border-2 border-white shadow-xl">
              <BeigeCoverImage
                src={collage[1]}
                alt=""
                className="beige-img-zoom h-36 w-full object-cover"
                placeholderClassName="h-36 bg-[#E5D9C5]"
                placeholder=""
              />
            </div>
            <div className="overflow-hidden rounded-2xl border-2 border-white shadow-xl">
              <BeigeCoverImage
                src={collage[2]}
                alt=""
                className="beige-img-zoom h-36 w-full object-cover"
                placeholderClassName="h-36 bg-[#E5D9C5]"
                placeholder=""
              />
            </div>
          </div>
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

      <main id="residencial" className="py-24">
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
                <div className="mb-16 flex flex-col justify-between md:flex-row md:items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A39073]">
                      {dict.results.kicker}
                    </p>
                    <h2 className="beige-section__title mt-2 text-3xl text-[#2D2A26] sm:text-5xl">
                      {catalogHeading(dict, oferta, city, total)}
                    </h2>
                  </div>
                  {propertyType || bedrooms || city ? (
                    <Link
                      href={clearHref}
                      className="mt-4 text-sm font-semibold text-[#2D2A26] transition-colors hover:text-[#A39073] md:mt-0"
                    >
                      {dict.results.clearFilters}
                    </Link>
                  ) : null}
                </div>
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {gridListings.map((listing) => (
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
