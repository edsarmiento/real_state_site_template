import type { CSSProperties } from "react";
import Link from "next/link";
import { ListingInquiryForm } from "@/components/listing-inquiry-form";
import { ListingPhotoGallery } from "@/components/listing-photo-gallery";
import { ListingShareButton } from "@/components/listing-share-button";
import { ListingWhatsAppButton } from "@/components/listing-whatsapp-button";
import { OpenInMapsLink } from "@/components/open-in-maps-link";
import {
  formatRentCents,
  listingPublicSpecsLocalized,
  parseOfferType,
} from "@/lib/listing-types";
import { localizedPropertyTypeLabel } from "@/lib/property-labels";
import { listingPublicUrl } from "@/lib/site-config-env";
import { localizedHref } from "@/lib/site-i18n";
import type { ListingDetailThemeProps } from "@/themes/theme-types";
import { UltraFooter } from "@/themes/ultra/ultra-footer";
import { UltraHeader } from "@/themes/ultra/ultra-header";
import { UltraIconArrowLeft, UltraIconWhatsApp } from "@/themes/ultra/ultra-icons";
import { getUltraCopy } from "@/themes/ultra/ultra-copy";
import { UltraReveal } from "@/themes/ultra/ultra-reveal";
import { UltraShell } from "@/themes/ultra/ultra-shell";
import { getUltraUi } from "@/themes/ultra/ultra-ui";

export async function UltraListingDetail({
  listing,
  lang,
}: ListingDetailThemeProps) {
  const { content, dict, locale, defaultLocale, config } =
    await getUltraUi(lang);
  const copy = getUltraCopy(locale);
  const photos = listing.photos ?? [];
  const offerType = parseOfferType(listing.offer_type);
  const specs = listingPublicSpecsLocalized(listing, dict);
  const typeLabel = localizedPropertyTypeLabel(dict, listing.property_type);
  const isSale = offerType === "sale";
  const agency = content.brand.name;
  const hasMap = listing.latitude != null && listing.longitude != null;
  const hasPlace = Boolean(listing.address_label) || hasMap;
  const backHref = localizedHref("/#catalogo", locale, null, defaultLocale);
  const listingUrl = listingPublicUrl(
    listing.slug,
    config.siteOrigin,
    localizedHref(
      `/inmueble/${encodeURIComponent(listing.slug)}`,
      locale,
      null,
      defaultLocale,
    ),
  );
  const description = listing.description?.trim() ?? "";
  const offerLabel = isSale ? dict.listing.sale : dict.listing.rent;
  const priceSuffix = offerType === "rent" ? dict.listing.perMonth : null;

  return (
    <UltraShell floatRaised lang={lang} particles="detail">
      <UltraHeader lang={lang} />

      <main className="ultra-detail">
        <div className="ultra-shell ultra-detail__wrap">
          <UltraReveal variant="fade">
            <Link href={backHref} className="ultra-detail__back">
              <UltraIconArrowLeft className="h-4 w-4" />
              {dict.listing.back}
            </Link>
          </UltraReveal>

          <UltraReveal variant="up" durationMs={800}>
          <header className="ultra-detail__heading">
            <h1 className="ultra-detail__title">{listing.title}</h1>
            <div className="ultra-detail__meta">
              <p className="ultra-detail__location">
                {listing.location_label || typeLabel}
              </p>
              {config.showShareButton ? (
                <ListingShareButton
                  url={listingUrl}
                  title={listing.title}
                  label={dict.listing.share}
                  copyLabel={dict.listing.shareCopy}
                  copiedLabel={dict.listing.shareCopied}
                  failedLabel={dict.listing.shareFailed}
                  closeLabel={dict.listing.shareClose}
                  className="ultra-share-button"
                />
              ) : null}
            </div>
          </header>
          </UltraReveal>

          <div className="ultra-detail__layout">
            <div className="ultra-detail__primary">
              <UltraReveal variant="up" durationMs={850}>
              <div className="ultra-gallery-wrap">
                <ListingPhotoGallery
                  title={listing.title}
                  photos={photos}
                  fallbackUrl={listing.photo_url}
                  className="ultra-gallery"
                  styledLayout={false}
                  labels={dict.listing.gallery}
                />
                <span className="ultra-gallery__badge">{offerLabel}</span>
              </div>
              </UltraReveal>

              {description ? (
                <UltraReveal variant="up" delayMs={80}>
                <section className="ultra-detail__copy">
                  <h2>{dict.listing.description}</h2>
                  <p className="ultra-detail__prose">{description}</p>
                </section>
                </UltraReveal>
              ) : null}
            </div>

            <aside className="ultra-detail__sidebar">
              <UltraReveal variant="right" durationMs={850} className="ultra-detail__sidebar-motion">
              <div className="ultra-detail__price-card">
                <p className="ultra-detail__price-kicker">
                  {isSale ? copy.priceSale : copy.priceRent}
                </p>
                <p className="ultra-detail__price">
                  {formatRentCents(listing.rent_cents, listing.currency)}
                  {priceSuffix ? (
                    <span className="ultra-detail__price-unit">
                      {priceSuffix}
                    </span>
                  ) : null}
                </p>
                {typeLabel ? (
                  <p className="ultra-detail__type">{typeLabel}</p>
                ) : null}
              </div>

              {specs.length > 0 ? (
                <dl className="ultra-detail__specs">
                  {specs.map((spec, index) => (
                    <div
                      key={spec.key}
                      className="ultra-detail__spec"
                      data-ultra-reveal="up"
                      style={{ "--ultra-delay": `${index * 80}ms` } as CSSProperties}
                    >
                      <dt>{dict.listing.specs[spec.key]}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <div id="inquiry" className="ultra-detail__inquiry">
                <h2>
                  {isSale
                    ? dict.listing.inquireSale
                    : dict.listing.inquireRent}
                </h2>
                <p>
                  {isSale
                    ? dict.listing.inquireSaleCopy
                    : dict.listing.inquireRentCopy}
                </p>
                {listing.contact_phone ? (
                  <ListingWhatsAppButton
                    phone={listing.contact_phone}
                    title={listing.title}
                    listingUrl={listingUrl}
                    offerType={offerType}
                    saleLabel={dict.inquiry.whatsappSale}
                    rentLabel={dict.inquiry.whatsappRent}
                    messageTemplate={dict.inquiry.whatsappMessage}
                    unstyled
                    className="ultra-btn ultra-detail__whatsapp"
                    ariaLabel={`${isSale ? dict.inquiry.whatsappSale : dict.inquiry.whatsappRent}. ${dict.a11y.opensInNewTab}`}
                    icon={<UltraIconWhatsApp className="h-5 w-5" />}
                  />
                ) : null}
                {listing.contact_phone ? (
                  <p className="ultra-detail__or">{dict.listing.orLeaveDetails}</p>
                ) : null}
                <ListingInquiryForm
                  slug={listing.slug}
                  offerType={offerType}
                  copy={dict.inquiry}
                  inputIdPrefix="ultra-inquiry"
                  classNames={{
                    form: "ultra-inquiry",
                    label: "ultra-inquiry__label",
                    control: "ultra-field",
                    textarea: "ultra-field ultra-field--area",
                    error: "ultra-inquiry__error",
                    success: "ultra-inquiry__success",
                    submit: "ultra-btn ultra-form-submit",
                  }}
                />
              </div>

              <section className="ultra-detail__place">
                {hasPlace ? <h2>{dict.listing.location}</h2> : null}
                {listing.address_label ? (
                  <p>{listing.address_label}</p>
                ) : null}
                {listing.latitude != null && listing.longitude != null ? (
                  <OpenInMapsLink
                    latitude={listing.latitude}
                    longitude={listing.longitude}
                    label={listing.title}
                    showCoordinates={false}
                    linkText={dict.listing.viewMap}
                    className="ultra-inline-link"
                  />
                ) : null}
                <p className="ultra-detail__listed">
                  {dict.listing.listedBy}{" "}
                  <strong>{agency}</strong>
                </p>
              </section>

              </UltraReveal>
            </aside>
          </div>
        </div>
      </main>

      <div className="ultra-detail__mobile-cta">
        <a href="#inquiry" className="ultra-btn">
          {listing.contact_phone
            ? dict.listing.mobileCtaWithPhone
            : dict.listing.mobileCta}
        </a>
      </div>

      <UltraFooter lang={lang} />
    </UltraShell>
  );
}
