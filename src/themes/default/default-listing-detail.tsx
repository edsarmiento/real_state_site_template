import type { ReactNode } from "react";
import { ListingInquiryForm } from "@/components/listing-inquiry-form";
import { ListingOfferBadge } from "@/components/listing-offer-badge";
import { ListingPhotoGallery } from "@/components/listing-photo-gallery";
import { ListingWhatsAppButton } from "@/components/listing-whatsapp-button";
import { ListingShareButton } from "@/components/listing-share-button";
import { OpenInMapsLink } from "@/components/open-in-maps-link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  formatRentCents,
  listingPublicSpecsLocalized,
  parseOfferType,
} from "@/lib/listing-types";
import type { PropertyType } from "@/lib/property-types";
import { listingPublicUrl } from "@/lib/site-config-env";
import { localizedHref } from "@/lib/site-i18n";
import { getSiteUiFromResolved } from "@/lib/site-ui";
import type { ListingDetailThemeProps } from "@/themes/theme-types";

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[calc(50%-0.3125rem)] flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 sm:min-w-[6.5rem]">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-zinc-950 sm:text-xl">
        {value}
      </dd>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {title}
      </h2>
      <div className="mt-3 text-zinc-800">{children}</div>
    </div>
  );
}

export function DefaultListingDetail({
  listing,
  lang,
  content,
  config,
  locale,
}: ListingDetailThemeProps) {
  const ui = getSiteUiFromResolved({ content, config, locale });
  const listingUrl = listingPublicUrl(
    listing.slug,
    ui.config.siteOrigin,
    localizedHref(
      `/inmueble/${encodeURIComponent(listing.slug)}`,
      ui.locale,
      null,
      ui.defaultLocale,
    ),
  );
  const photos = listing.photos ?? [];
  const offerType = parseOfferType(listing.offer_type);
  const priceSuffix =
    offerType === "rent" ? ui.dict.listing.perMonth : null;
  const specs = listingPublicSpecsLocalized(listing, ui.dict);
  const typeLabel =
    ui.dict.propertyTypes[listing.property_type as PropertyType] ??
    listing.property_type;
  const isSale = offerType === "sale";
  const agency = listing.agency_name || ui.config.siteName;

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader lang={lang} />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8">
        <ListingPhotoGallery
          title={listing.title}
          photos={photos}
          fallbackUrl={listing.photo_url}
          styledLayout={false}
          locale={locale}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <article>
            <div className="flex flex-wrap items-center gap-2">
              <ListingOfferBadge
                offerType={offerType}
                styledLayout={false}
                saleLabel={ui.dict.listing.sale}
                rentLabel={ui.dict.listing.rent}
              />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                {typeLabel}
              </span>
            </div>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.12em] text-zinc-600">
              {listing.location_label}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl">
              {listing.title}
            </h1>

            {ui.config.showShareButton ? (
              <div className="mt-4">
                <ListingShareButton
                  url={listingUrl}
                  title={listing.title}
                  label={ui.dict.listing.share}
                  copyLabel={ui.dict.listing.shareCopy}
                  copiedLabel={ui.dict.listing.shareCopied}
                  failedLabel={ui.dict.listing.shareFailed}
                  closeLabel={ui.dict.listing.shareClose}
                />
              </div>
            ) : null}

            <p className="mt-5 text-3xl font-semibold tabular-nums tracking-tight text-zinc-950 sm:text-4xl">
              {formatRentCents(listing.rent_cents, listing.currency)}
              {priceSuffix ? (
                <span className="ml-2 text-lg font-medium text-zinc-500 sm:text-base">
                  {priceSuffix}
                </span>
              ) : null}
            </p>

            <dl className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
              {specs.map((spec) => (
                <Spec key={spec.key} label={spec.label} value={spec.value} />
              ))}
            </dl>

            {listing.description ? (
              <InfoCard title={ui.dict.listing.description}>
                <p className="whitespace-pre-wrap text-base leading-relaxed">
                  {listing.description}
                </p>
              </InfoCard>
            ) : null}

            {listing.address_label ||
            (listing.latitude != null && listing.longitude != null) ? (
              <InfoCard title={ui.dict.listing.location}>
                {listing.address_label ? (
                  <p className="text-base leading-relaxed">{listing.address_label}</p>
                ) : null}
                {listing.latitude != null && listing.longitude != null ? (
                  <div className={listing.address_label ? "mt-4" : undefined}>
                    <OpenInMapsLink
                      latitude={listing.latitude}
                      longitude={listing.longitude}
                      label={listing.title}
                      showCoordinates={false}
                      linkText={ui.dict.listing.viewMap}
                      className="text-sm font-semibold text-zinc-800 underline-offset-2 hover:underline"
                    />
                  </div>
                ) : null}
              </InfoCard>
            ) : null}

            <p className="mt-10 text-sm text-zinc-500">
              {ui.dict.listing.listedBy}{" "}
              <span className="font-semibold text-zinc-900">{agency}</span>
            </p>
          </article>

          <aside className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
              {isSale ? ui.dict.listing.inquireSale : ui.dict.listing.inquireRent}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              {isSale
                ? ui.dict.listing.inquireSaleCopy
                : ui.dict.listing.inquireRentCopy}
            </p>
            {listing.contact_phone ? (
              <div className="mt-5">
                <ListingWhatsAppButton
                  phone={listing.contact_phone}
                  title={listing.title}
                  listingUrl={listingUrl}
                  offerType={offerType}
                  saleLabel={ui.dict.inquiry.whatsappSale}
                  rentLabel={ui.dict.inquiry.whatsappRent}
                  messageTemplate={ui.dict.inquiry.whatsappMessage}
                />
              </div>
            ) : null}
            <div className={listing.contact_phone ? "mt-6" : "mt-5"}>
              {listing.contact_phone ? (
                <p className="mb-3 text-center text-sm font-medium text-zinc-700">
                  {ui.dict.listing.orLeaveDetails}
                </p>
              ) : null}
              <ListingInquiryForm
                slug={listing.slug}
                offerType={offerType}
                styledLayout={false}
                copy={ui.dict.inquiry}
              />
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
