import type { CSSProperties } from "react";
import Link from "next/link";
import { ListingInquiryForm } from "@/components/listing-inquiry-form";
import { ListingPhotoGallery } from "@/components/listing-photo-gallery";
import { ListingShareButton } from "@/components/listing-share-button";
import { ListingWhatsAppButton } from "@/components/listing-whatsapp-button";
import {
  listingPublicSpecsLocalized,
  parseOfferType,
} from "@/lib/listing-types";
import { googleMapsSearchUrl } from "@/lib/maps-links";
import { localizedPropertyTypeLabel } from "@/lib/property-labels";
import { listingPublicUrl } from "@/lib/site-config-env";
import { localizedHref } from "@/lib/site-i18n";
import type { ListingDetailThemeProps } from "@/themes/theme-types";
import { displayListingTitle } from "@/themes/beige/beige-display";
import { BeigeFooter } from "@/themes/beige/beige-footer";
import { BeigeHeader } from "@/themes/beige/beige-header";
import { BeigeReveal } from "@/themes/beige/beige-reveal";
import {
  BeigeIconArrowLeft,
  BeigeIconBath,
  BeigeIconBed,
  BeigeIconExternal,
  BeigeIconHome,
  BeigeIconMapPin,
  BeigeIconMaximize,
  BeigeIconWhatsApp,
} from "@/themes/beige/beige-icons";
import { BeigeShell } from "@/themes/beige/beige-shell";
import { formatBeigePriceParts, getBeigeUi } from "@/themes/beige/beige-ui";

const SPEC_STAGGER_MS = [0, 80, 160, 240] as const;

export function BeigeListingDetail({
  listing,
  lang,
  content,
  config,
  locale,
}: ListingDetailThemeProps) {
  const { dict, defaultLocale, showShareButton, siteOrigin } = getBeigeUi({
    content,
    config,
    locale,
  });
  const photos = listing.photos ?? [];
  const offerType = parseOfferType(listing.offer_type);
  const specs = listingPublicSpecsLocalized(listing, dict);
  const typeLabel = localizedPropertyTypeLabel(dict, listing.property_type);
  const isSale = offerType === "sale";
  const agency = listing.agency_name || content.brand.name;
  const hasMap = listing.latitude != null && listing.longitude != null;
  const hasPlace = Boolean(listing.address_label) || hasMap;
  const backHref = localizedHref("/#catalogo", locale, null, defaultLocale);
  const listingUrl = listingPublicUrl(
    listing.slug,
    siteOrigin,
    localizedHref(
      `/inmueble/${encodeURIComponent(listing.slug)}`,
      locale,
      null,
      defaultLocale,
    ),
  );
  const price = formatBeigePriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const description = listing.description?.trim() ?? "";
  const offerLabel = isSale ? dict.listing.sale : dict.listing.rent;

  return (
    <BeigeShell floatRaised lang={lang}>
      <BeigeHeader lang={lang} />

      <main className="beige-detail">
        <div className="beige-shell beige-detail__wrap">
          <BeigeReveal variant="up" durationMs={700}>
            <Link href={backHref} className="beige-detail__back">
              <BeigeIconArrowLeft className="h-4 w-4" />
              {dict.listing.back}
            </Link>
          </BeigeReveal>

          <section className="beige-detail__showcase">
            <BeigeReveal
              variant="left-zoom"
              durationMs={950}
              className="beige-detail__gallery"
            >
              <div className="beige-gallery-wrap">
                <ListingPhotoGallery
                  title={listing.title}
                  photos={photos}
                  fallbackUrl={listing.photo_url}
                  className="beige-gallery"
                  styledLayout={false}
                  labels={dict.listing.gallery}
                />
                <span className="beige-gallery__badge">{offerLabel}</span>
              </div>
            </BeigeReveal>

            <BeigeReveal
              variant="right"
              durationMs={900}
              className="beige-detail__aside"
            >
              <aside id="inquiry" className="beige-detail__inquiry">
                <div>
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
                </div>
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
                    className="beige-btn beige-detail__whatsapp"
                    ariaLabel={`${isSale ? dict.inquiry.whatsappSale : dict.inquiry.whatsappRent}. ${dict.a11y.opensInNewTab}`}
                    icon={<BeigeIconWhatsApp className="h-5 w-5" />}
                  />
                ) : null}
                {listing.contact_phone ? (
                  <p className="beige-detail__or">{dict.listing.orLeaveDetails}</p>
                ) : null}
                <ListingInquiryForm
                  slug={listing.slug}
                  offerType={offerType}
                  copy={dict.inquiry}
                  inputIdPrefix="beige-inquiry"
                  classNames={{
                    form: "beige-inquiry",
                    label: "beige-search__label",
                    control: "beige-field",
                    textarea: "beige-field",
                    error: "beige-inquiry__error",
                    success: "beige-form-hint",
                    submit: "beige-btn beige-form-submit",
                  }}
                />
              </aside>
            </BeigeReveal>
          </section>

          <section className="beige-detail__identity-row">
            <BeigeReveal
              variant="up"
              durationMs={800}
              className="beige-detail__identity"
            >
              <div className="beige-detail__identity-head">
                <p className="beige-eyebrow">
                  {listing.location_label || typeLabel}
                </p>
                {showShareButton ? (
                  <ListingShareButton
                    url={listingUrl}
                    title={listing.title}
                    label={dict.listing.share}
                    copyLabel={dict.listing.shareCopy}
                    copiedLabel={dict.listing.shareCopied}
                    failedLabel={dict.listing.shareFailed}
                    closeLabel={dict.listing.shareClose}
                    className="beige-share-button"
                  />
                ) : null}
              </div>
              <h1 className="beige-detail__title">
                {displayListingTitle(listing.title) || listing.title}
              </h1>
            </BeigeReveal>

            <BeigeReveal
              variant="zoom"
              durationMs={850}
              className="beige-detail__price-panel"
            >
              <p className="beige-detail__price">
                {price.amount}{" "}
                <span className="beige-detail__price-unit">
                  {price.currency}
                  {offerType === "rent" ? ` ${dict.listing.perMonth}` : ""}
                </span>
              </p>
            </BeigeReveal>
          </section>

          <div className="beige-detail__bento">
            {specs.length > 0 ? (
              <dl className="beige-detail__specs">
                {specs.map((spec, index) => (
                  <div
                    key={spec.key}
                    className={
                      index === 1 || index === 2
                        ? "beige-detail__spec beige-detail__spec--tint"
                        : "beige-detail__spec"
                    }
                    data-beige-reveal="up"
                    style={
                      {
                        "--beige-delay": `${SPEC_STAGGER_MS[index] ?? 0}ms`,
                        "--beige-duration": "800ms",
                      } as CSSProperties
                    }
                  >
                    <dt>
                      {spec.key === "bedrooms" ? (
                        <BeigeIconBed className="beige-detail__spec-icon" />
                      ) : spec.key === "bathrooms" ? (
                        <BeigeIconBath className="beige-detail__spec-icon" />
                      ) : spec.key === "land" || spec.key === "built" ? (
                        <BeigeIconMaximize className="beige-detail__spec-icon" />
                      ) : (
                        <BeigeIconHome className="beige-detail__spec-icon" />
                      )}
                      {dict.listing.specs[spec.key]}
                    </dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {description ? (
              <BeigeReveal
                variant="up"
                durationMs={800}
                className="beige-detail__copy"
              >
                <section>
                  <h2>{dict.listing.description}</h2>
                  <div
                    className="beige-detail__prose"
                    data-beige-listing-description
                  >
                    {description}
                  </div>
                </section>
              </BeigeReveal>
            ) : null}

            <BeigeReveal
              variant="right"
              durationMs={850}
              className={
                description
                  ? "beige-detail__place"
                  : "beige-detail__place beige-detail__place--wide"
              }
            >
              {hasPlace ? (
                <section>
                  <div className="beige-detail__place-head">
                    <h2>{dict.listing.location}</h2>
                    {listing.latitude != null && listing.longitude != null ? (
                      <a
                        href={googleMapsSearchUrl(
                          listing.latitude,
                          listing.longitude,
                        )}
                        className="beige-soft-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <BeigeIconExternal className="h-3.5 w-3.5" />
                        {dict.listing.viewMap}
                      </a>
                    ) : null}
                  </div>
                  <div className="beige-detail__address">
                    <span className="beige-detail__address-icon" aria-hidden>
                      <BeigeIconMapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="beige-detail__agency">{agency}</p>
                      {listing.address_label ? (
                        <p>{listing.address_label}</p>
                      ) : null}
                    </div>
                  </div>
                </section>
              ) : null}
              <p className="beige-detail__listed">
                {dict.listing.listedBy}: <strong>{agency}</strong>
              </p>
            </BeigeReveal>
          </div>
        </div>
      </main>

      <div className="beige-detail__mobile-cta">
        <a href="#inquiry" className="beige-btn">
          {listing.contact_phone
            ? dict.listing.mobileCtaWithPhone
            : dict.listing.mobileCta}
        </a>
      </div>

      <BeigeFooter lang={lang} />
    </BeigeShell>
  );
}
