import Link from "next/link";
import { parseListingDescriptionForDisplay } from "@/lib/listing-description";
import { parseOfferType } from "@/lib/listing-types";
import { googleMapsSearchUrl } from "@/lib/maps-links";
import { localizedHref } from "@/lib/site-i18n";
import type { ListingDetailThemeProps } from "@/themes/theme-types";
import { BeigeFooter } from "@/themes/beige/beige-footer";
import { BeigeGallery } from "@/themes/beige/beige-gallery";
import { BeigeHeader } from "@/themes/beige/beige-header";
import {
  BeigeIconArrowLeft,
  BeigeIconBath,
  BeigeIconBed,
  BeigeIconExternal,
  BeigeIconHome,
  BeigeIconMapPin,
  BeigeIconMaximize,
} from "@/themes/beige/beige-icons";
import { BeigeInquiryForm } from "@/themes/beige/beige-inquiry-form";
import { BeigeListingWhatsAppButton } from "@/themes/beige/beige-listing-whatsapp";
import { BeigeShareButton } from "@/themes/beige/beige-share-button";
import { BeigeShell } from "@/themes/beige/beige-shell";
import { displayListingTitle } from "@/themes/beige/beige-display";
import { formatBeigePriceParts, getBeigeUi } from "@/themes/beige/beige-ui";
import { luxuryVisibleSpecs } from "@/themes/luxury/luxury-specs";

export async function BeigeListingDetail({
  listing,
  lang,
}: ListingDetailThemeProps) {
  const { content, dict, locale, defaultLocale } = await getBeigeUi(lang);
  const photos = listing.photos ?? [];
  const offerType = parseOfferType(listing.offer_type);
  const specs = luxuryVisibleSpecs(listing);
  const typeLabel =
    dict.propertyTypes[
      listing.property_type as keyof typeof dict.propertyTypes
    ] ?? listing.property_type;
  const isSale = offerType === "sale";
  const agency = listing.agency_name || content.brand.name;
  const hasMap = listing.latitude != null && listing.longitude != null;
  const backHref = localizedHref("/#residencial", locale, null, defaultLocale);
  const price = formatBeigePriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const descriptionBlocks = parseListingDescriptionForDisplay(
    listing.description ?? "",
  );

  return (
    <BeigeShell floatRaised lang={lang}>
      <BeigeHeader lang={lang} variant="detail" />

      <main className="bg-[#FBF9F5] py-12">
        <div className="mx-auto max-w-7xl space-y-8 px-6">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E5D9C5] bg-white px-4 py-2 text-sm font-semibold text-[#8A7759] shadow-sm transition-colors hover:text-[#2D2A26]"
          >
            <BeigeIconArrowLeft className="h-4 w-4" />
            {dict.listing.back}
          </Link>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <BeigeGallery
                title={listing.title}
                photos={photos}
                fallbackUrl={listing.photo_url}
                offerLabel={isSale ? dict.listing.sale : dict.listing.rent}
                dict={dict}
              />

              <div className="space-y-6 rounded-3xl border border-[#E5D9C5] bg-white p-8 shadow-sm">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#A39073]">
                    {listing.location_label || typeLabel}
                  </p>
                  <h1 className="beige-serif text-3xl font-normal leading-tight text-[#2D2A26] sm:text-4xl">
                    {displayListingTitle(listing.title) || listing.title}
                  </h1>
                  <p className="mt-3 text-3xl font-bold text-[#8F9F81]">
                    {price.amount}{" "}
                    <span className="text-base font-normal text-[#A39073]">
                      {price.currency}
                      {offerType === "rent" ? ` ${dict.listing.perMonth}` : ""}
                    </span>
                  </p>
                </div>

                {specs.length > 0 ? (
                  <dl className="grid grid-cols-2 gap-4 border-y border-[#F4EFE6] py-6 text-center sm:grid-cols-4">
                    {specs.map((spec) => (
                      <div
                        key={spec.key}
                        className="rounded-2xl bg-[#FBF9F5] p-4"
                      >
                        <dt className="text-xs font-semibold uppercase text-[#A39073]">
                          {spec.key === "bedrooms" ? (
                            <BeigeIconBed className="mx-auto mb-1 h-5 w-5 text-[#A4B494]" />
                          ) : spec.key === "bathrooms" ? (
                            <BeigeIconBath className="mx-auto mb-1 h-5 w-5 text-[#A4B494]" />
                          ) : spec.key === "land" || spec.key === "built" ? (
                            <BeigeIconMaximize className="mx-auto mb-1 h-5 w-5 text-[#A4B494]" />
                          ) : (
                            <BeigeIconHome className="mx-auto mb-1 h-5 w-5 text-[#A4B494]" />
                          )}
                          {dict.listing.specs[spec.key]}
                        </dt>
                        <dd className="beige-serif mt-1 text-lg font-bold">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {descriptionBlocks.length > 0 ? (
                  <section className="space-y-3">
                    <h2 className="text-xl font-medium">
                      {dict.listing.description}
                    </h2>
                    <div className="space-y-4 text-sm font-light leading-relaxed text-[#8A7759]">
                      {descriptionBlocks.map((block, index) => {
                        if (block.type === "paragraph") {
                          return <p key={`p-${index}`}>{block.text}</p>;
                        }
                        if (block.type === "subheading") {
                          return (
                            <p
                              key={`h-${index}`}
                              className="font-medium text-[#2D2A26]"
                            >
                              {block.text}
                            </p>
                          );
                        }
                        if (block.type === "callout") {
                          return (
                            <p
                              key={`c-${index}`}
                              className="border-l-2 border-[#A4B494] pl-4"
                            >
                              {block.text}
                            </p>
                          );
                        }
                        if (block.type === "list") {
                          return (
                            <ul
                              key={`l-${index}`}
                              className="list-disc space-y-1 pl-5"
                            >
                              {block.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <p key={`t-${index}`} className="flex flex-wrap gap-2">
                            {block.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-[#F4EFE6] px-3 py-1 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </p>
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {listing.address_label || hasMap ? (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-xl font-medium">
                        {dict.listing.location}
                      </h2>
                      {listing.latitude != null && listing.longitude != null ? (
                        <a
                          href={googleMapsSearchUrl(
                            listing.latitude,
                            listing.longitude,
                          )}
                          className="beige-soft-btn inline-flex items-center gap-1.5 rounded-xl border border-[#E5D9C5] bg-[#FBF9F5] px-4 py-2 text-xs font-semibold text-[#2D2A26] shadow-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <BeigeIconExternal className="h-3.5 w-3.5" />
                          {dict.listing.viewMap}
                        </a>
                      ) : null}
                    </div>
                    <div className="space-y-3 rounded-2xl border border-[#E5D9C5] bg-[#FBF9F5] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A4B494]/10 text-[#A4B494]">
                          <BeigeIconMapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{agency}</p>
                          {listing.address_label ? (
                            <p className="text-xs font-light text-[#A39073]">
                              {listing.address_label}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </section>
                ) : null}

                <div className="flex items-center justify-between border-t border-[#F4EFE6] pt-4 text-xs text-[#A39073]">
                  <span>
                    {dict.listing.listedBy}:{" "}
                    <strong className="font-medium text-[#2D2A26]">
                      {agency}
                    </strong>
                  </span>
                  <BeigeShareButton
                    slug={listing.slug}
                    title={listing.title}
                    dict={dict}
                    className="text-xs font-semibold uppercase tracking-wider text-[#8A7759]"
                  />
                </div>
              </div>
            </div>

            <aside id="inquiry" className="space-y-6 lg:col-span-4">
              <div className="sticky top-28 space-y-6 rounded-3xl border border-[#E5D9C5] bg-white p-8 shadow-xl">
                <div>
                  <h2 className="text-2xl font-normal">
                    {isSale
                      ? dict.listing.inquireSale
                      : dict.listing.inquireRent}
                  </h2>
                  <p className="mt-1 text-xs font-light text-[#A39073]">
                    {isSale
                      ? dict.listing.inquireSaleCopy
                      : dict.listing.inquireRentCopy}
                  </p>
                </div>
                {listing.contact_phone ? (
                  <BeigeListingWhatsAppButton
                    phone={listing.contact_phone}
                    title={listing.title}
                    slug={listing.slug}
                    offerType={offerType}
                    dict={dict}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3.5 text-sm font-medium text-white shadow-md transition hover:bg-[#20ba5a]"
                  />
                ) : null}
                {listing.contact_phone ? (
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-[#E5D9C5]" />
                    <span className="mx-4 flex-shrink text-xs uppercase tracking-widest text-[#A39073]">
                      {dict.listing.orLeaveDetails}
                    </span>
                    <div className="flex-grow border-t border-[#E5D9C5]" />
                  </div>
                ) : null}
                <BeigeInquiryForm
                  slug={listing.slug}
                  offerType={offerType}
                  dict={dict}
                  locale={locale}
                  defaultLocale={defaultLocale}
                  privacyHref={content.legal.privacyNoticeUrl}
                />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <div className="sticky bottom-0 z-40 border-t border-[#E5D9C5] bg-[#FBF9F5]/95 p-3 backdrop-blur lg:hidden">
        <a
          href="#inquiry"
          className="beige-btn block rounded-2xl bg-[#A4B494] px-4 py-3 text-center text-sm font-semibold text-[#2D2A26]"
        >
          {listing.contact_phone
            ? dict.listing.mobileCtaWithPhone
            : dict.listing.mobileCta}
        </a>
      </div>

      <BeigeFooter lang={lang} />
    </BeigeShell>
  );
}
