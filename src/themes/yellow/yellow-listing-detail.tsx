import Link from "next/link";
import { ListingInquiryForm } from "@/components/listing-inquiry-form";
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
import { getYellowCopy } from "@/themes/yellow/yellow-copy";
import { displayListingTitle } from "@/themes/yellow/yellow-display";
import { YellowFooter } from "@/themes/yellow/yellow-footer";
import { YellowHeader } from "@/themes/yellow/yellow-header";
import {
  YellowIconArrowLeft,
  YellowIconBath,
  YellowIconBed,
  YellowIconExternal,
  YellowIconHome,
  YellowIconMapPin,
  YellowIconRuler,
} from "@/themes/yellow/yellow-icons";
import { YellowListingGallery } from "@/themes/yellow/yellow-listing-gallery";
import { YellowReveal } from "@/themes/yellow/yellow-reveal";
import { YellowShell } from "@/themes/yellow/yellow-shell";
import { formatYellowPriceParts, getYellowUi } from "@/themes/yellow/yellow-ui";

export async function YellowListingDetail({
  listing,
  lang,
}: ListingDetailThemeProps) {
  const { content, dict, locale, defaultLocale, showShareButton, siteOrigin } =
    await getYellowUi(lang);
  const copy = getYellowCopy(locale);
  const photos = Array.isArray(listing.photos) ? listing.photos : [];
  const offerType = parseOfferType(listing.offer_type);
  const specs = listingPublicSpecsLocalized(listing, dict);
  const typeLabel = localizedPropertyTypeLabel(dict, listing.property_type);
  const isSale = offerType === "sale";
  const agency = listing.agency_name || content.brand.name;
  const hasMap = listing.latitude != null && listing.longitude != null;
  const hasPlace = Boolean(listing.address_label) || hasMap;
  const backHref = localizedHref("/#propiedades", locale, null, defaultLocale);
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
  const price = formatYellowPriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const description = listing.description?.trim() ?? "";
  const offerLabel = isSale ? dict.listing.sale : dict.listing.rent;

  return (
    <YellowShell lang={lang}>
      <YellowHeader lang={lang} />

      <main className="yellow-detail">
        <div className="yellow-shell yellow-detail__wrap">
          <YellowReveal variant="up">
            <Link href={backHref} className="yellow-detail__back">
              <YellowIconArrowLeft className="h-3.5 w-3.5" />
              {dict.listing.back}
            </Link>
          </YellowReveal>

          <div className="yellow-detail__grid">
            <div className="yellow-detail__main">
              <YellowReveal variant="fade">
                <YellowListingGallery
                  title={listing.title}
                  photos={photos}
                  fallbackUrl={listing.photo_url}
                  labels={dict.listing.gallery}
                  offerLabel={offerLabel}
                  expandLabel={copy.expandGallery}
                  closeLabel={copy.closeGallery}
                />
              </YellowReveal>

              <YellowReveal variant="up">
                <header className="yellow-glass yellow-detail__summary">
                  <div className="yellow-detail__summary-top">
                    {listing.location_label ? (
                      <p className="yellow-detail__place-line">
                        <YellowIconMapPin className="h-4 w-4" />
                        <span>{listing.location_label}</span>
                      </p>
                    ) : (
                      <p className="yellow-eyebrow">{typeLabel || offerLabel}</p>
                    )}
                    {showShareButton ? (
                      <ListingShareButton
                        url={listingUrl}
                        title={listing.title}
                        label={dict.listing.share}
                        copyLabel={dict.listing.shareCopy}
                        copiedLabel={dict.listing.shareCopied}
                        failedLabel={dict.listing.shareFailed}
                        closeLabel={dict.listing.shareClose}
                        className="yellow-share-button"
                      />
                    ) : null}
                  </div>
                  <h1 className="yellow-detail__title">
                    {displayListingTitle(listing.title) || listing.title}
                  </h1>
                  <div className="yellow-detail__price">
                    <p className="yellow-detail__price-eyebrow">{offerLabel}</p>
                    <p className="yellow-detail__price-value">
                      {price.amount}
                      <span>
                        {price.currency}
                        {offerType === "rent" ? ` ${dict.listing.perMonth}` : ""}
                      </span>
                    </p>
                  </div>
                </header>
              </YellowReveal>

              {specs.length > 0 ? (
                <dl className="yellow-detail__specs">
                  {specs.map((spec) => (
                    <div key={spec.key} className="yellow-detail__spec">
                      <dt>
                        {spec.key === "bedrooms" ? (
                          <YellowIconBed className="yellow-detail__spec-icon" />
                        ) : spec.key === "bathrooms" ? (
                          <YellowIconBath className="yellow-detail__spec-icon" />
                        ) : spec.key === "land" || spec.key === "built" ? (
                          <YellowIconRuler className="yellow-detail__spec-icon" />
                        ) : (
                          <YellowIconHome className="yellow-detail__spec-icon" />
                        )}
                        {dict.listing.specs[spec.key]}
                      </dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {description ? (
                <YellowReveal variant="up">
                  <section className="yellow-glass yellow-detail__copy">
                    <h2>{dict.listing.description}</h2>
                    <p className="yellow-detail__prose">{description}</p>
                  </section>
                </YellowReveal>
              ) : null}

              <section className="yellow-glass yellow-detail__place">
                <div className="yellow-detail__place-head">
                  <h2>{dict.listing.location}</h2>
                  {listing.latitude != null && listing.longitude != null ? (
                    <a
                      href={googleMapsSearchUrl(
                        listing.latitude,
                        listing.longitude,
                      )}
                      className="yellow-soft-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <YellowIconExternal className="h-3.5 w-3.5" />
                      {dict.listing.viewMap}
                    </a>
                  ) : null}
                </div>
                {hasPlace ? (
                  <div className="yellow-detail__address">
                    <span className="yellow-detail__address-icon" aria-hidden>
                      <YellowIconMapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="yellow-detail__agency">{agency}</p>
                      {listing.address_label ? (
                        <p>{listing.address_label}</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                <p className="yellow-detail__listed">
                  {dict.listing.listedBy}: <strong>{agency}</strong>
                </p>
              </section>
            </div>

            <aside className="yellow-detail__aside">
              <YellowReveal variant="left">
                <div id="inquiry" className="yellow-glass yellow-detail__inquiry">
                  <div>
                    <p className="yellow-eyebrow">
                      {isSale
                        ? dict.listing.inquireSale
                        : dict.listing.inquireRent}
                    </p>
                    <h2>
                      {isSale
                        ? dict.listing.inquireSaleCopy
                        : dict.listing.inquireRentCopy}
                    </h2>
                  </div>
                  {listing.contact_phone ? (
                    <>
                      <ListingWhatsAppButton
                        phone={listing.contact_phone}
                        title={listing.title}
                        listingUrl={listingUrl}
                        offerType={offerType}
                        saleLabel={dict.inquiry.whatsappSale}
                        rentLabel={dict.inquiry.whatsappRent}
                        messageTemplate={dict.inquiry.whatsappMessage}
                        unstyled
                        className="yellow-btn yellow-btn--whatsapp yellow-detail__whatsapp"
                        ariaLabel={`${isSale ? dict.inquiry.whatsappSale : dict.inquiry.whatsappRent}. ${dict.a11y.opensInNewTab}`}
                      />
                      <p className="yellow-detail__or">{dict.listing.orLeaveDetails}</p>
                    </>
                  ) : null}
                  <ListingInquiryForm
                    slug={listing.slug}
                    offerType={offerType}
                    styledLayout={false}
                    copy={dict.inquiry}
                    inputIdPrefix="yellow-inquiry"
                    classNames={{
                      form: "yellow-inquiry",
                      label: "yellow-search__label",
                      control: "yellow-field",
                      textarea: "yellow-field",
                      error: "yellow-inquiry__error",
                      success: "yellow-form-hint",
                      submit: "yellow-search__submit",
                    }}
                  />
                </div>
              </YellowReveal>
            </aside>
          </div>
        </div>
      </main>

      <YellowFooter lang={lang} />
    </YellowShell>
  );
}
