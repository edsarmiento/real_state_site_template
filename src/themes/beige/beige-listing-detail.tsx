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

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#8A7759]"
        >
          <BeigeIconArrowLeft className="h-4 w-4" />
          {dict.listing.back}
        </Link>

        <BeigeGallery
          title={listing.title}
          photos={photos}
          fallbackUrl={listing.photo_url}
          dict={dict}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-[#A39073]">
              <span className="rounded-full bg-[#F4EFE6] px-3 py-1 text-[#2D2A26]">
                {isSale ? dict.listing.sale : dict.listing.rent}
              </span>
              <span>{typeLabel}</span>
            </div>
            {listing.location_label ? (
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#8A7759]">
                <BeigeIconMapPin className="h-4 w-4" />
                {listing.location_label}
              </p>
            ) : null}
            <h1 className="beige-serif mt-3 text-4xl leading-tight">
              {listing.title}
            </h1>
            <p className="mt-4 text-2xl font-semibold">
              {price.amount}{" "}
              <span className="text-base font-normal text-[#A39073]">
                {price.currency}
                {offerType === "rent" ? ` ${dict.listing.perMonth}` : ""}
              </span>
            </p>
            <div className="mt-4">
              <BeigeShareButton
                slug={listing.slug}
                title={listing.title}
                dict={dict}
                className="text-sm text-[#8A7759] underline-offset-4 hover:underline"
              />
            </div>

            {specs.length > 0 ? (
              <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {specs.map((spec) => (
                  <div
                    key={spec.key}
                    className="rounded-xl border border-[#E5D9C5] bg-[#F4EFE6] p-4"
                  >
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A39073]">
                      {spec.key === "bedrooms" ? (
                        <BeigeIconBed className="h-4 w-4" />
                      ) : spec.key === "bathrooms" ? (
                        <BeigeIconBath className="h-4 w-4" />
                      ) : spec.key === "land" || spec.key === "built" ? (
                        <BeigeIconMaximize className="h-4 w-4" />
                      ) : (
                        <BeigeIconHome className="h-4 w-4" />
                      )}
                      {dict.listing.specs[spec.key]}
                    </dt>
                    <dd className="mt-2 text-lg">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {descriptionBlocks.length > 0 ? (
              <section className="mt-10">
                <h2 className="text-xs uppercase tracking-[0.2em] text-[#A39073]">
                  {dict.listing.description}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#2D2A26]">
                  {descriptionBlocks.map((block, index) => {
                    if (block.type === "paragraph") {
                      return <p key={`p-${index}`}>{block.text}</p>;
                    }
                    if (block.type === "subheading") {
                      return (
                        <p key={`h-${index}`} className="font-semibold">
                          {block.text}
                        </p>
                      );
                    }
                    if (block.type === "callout") {
                      return (
                        <p
                          key={`c-${index}`}
                          className="border-l-2 border-[#A4B494] pl-4 text-[#8A7759]"
                        >
                          {block.text}
                        </p>
                      );
                    }
                    if (block.type === "list") {
                      return (
                        <ul key={`l-${index}`} className="list-disc space-y-1 pl-5">
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
              <section className="mt-10 rounded-2xl border border-[#E5D9C5] bg-[#FBF9F5] p-6">
                <h2 className="text-xs uppercase tracking-[0.2em] text-[#A39073]">
                  {dict.listing.location}
                </h2>
                {listing.address_label ? (
                  <p className="mt-3 text-sm">{listing.address_label}</p>
                ) : null}
                {listing.latitude != null && listing.longitude != null ? (
                  <a
                    href={googleMapsSearchUrl(
                      listing.latitude,
                      listing.longitude,
                    )}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#8F9F81]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dict.listing.viewMap}
                    <BeigeIconExternal className="h-4 w-4" />
                  </a>
                ) : null}
              </section>
            ) : null}

            {agency ? (
              <p className="mt-8 text-sm text-[#8A7759]">
                <span className="uppercase tracking-wider">
                  {dict.listing.listedBy}
                </span>{" "}
                <span className="text-[#2D2A26]">{agency}</span>
              </p>
            ) : null}
          </article>

          <aside
            id="inquiry"
            className="h-fit rounded-2xl border border-[#E5D9C5] bg-[#FBF9F5] p-6 lg:sticky lg:top-28"
          >
            <h2 className="text-xl">
              {isSale ? dict.listing.inquireSale : dict.listing.inquireRent}
            </h2>
            <p className="mt-2 text-sm text-[#8A7759]">
              {isSale
                ? dict.listing.inquireSaleCopy
                : dict.listing.inquireRentCopy}
            </p>
            {listing.contact_phone ? (
              <div className="mt-5">
                <BeigeListingWhatsAppButton
                  phone={listing.contact_phone}
                  title={listing.title}
                  slug={listing.slug}
                  offerType={offerType}
                  dict={dict}
                  label={dict.listing.consultWhatsApp}
                />
              </div>
            ) : null}
            {listing.contact_phone ? (
              <p className="my-4 text-center text-xs uppercase tracking-wider text-[#A39073]">
                {dict.listing.orLeaveDetails}
              </p>
            ) : null}
            <div className="mt-4">
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
      </main>

      <div className="sticky bottom-0 z-40 border-t border-[#E5D9C5] bg-[#FBF9F5]/95 p-3 lg:hidden">
        <a
          href="#inquiry"
          className="block rounded-xl bg-[#A4B494] px-4 py-3 text-center text-sm font-semibold text-[#2D2A26]"
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
