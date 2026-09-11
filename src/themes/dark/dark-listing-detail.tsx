import { specIcon } from "@/themes/dark/dark-spec-icon";
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
import { getSessionContext } from "@/lib/session-context";
import { localizedHref } from "@/lib/site-i18n";
import type { ListingDetailThemeProps } from "@/themes/theme-types";
import { displayListingTitle } from "@/themes/dark/dark-copy";
import { DarkFooter } from "@/themes/dark/dark-footer";
import { DarkHeader } from "@/themes/dark/dark-header";
import { ListingPhotoGallery } from "@/components/listing-photo-gallery";
import { DarkReveal } from "@/themes/dark/dark-reveal";
import {
  DarkIconArrowLeft,
  DarkIconExternal,
  DarkIconMapPin,
  DarkIconWhatsApp,
} from "@/themes/dark/dark-icons";
import { DarkShell } from "@/themes/dark/dark-shell";
import { formatDarkPriceParts, getDarkUi } from "@/themes/dark/dark-ui";

export async function DarkListingDetail({
  listing,
  content,
  config,
  locale,
}: ListingDetailThemeProps) {
  const session = await getSessionContext();
  const ui = getDarkUi({ content, config, locale });
  const { dict, defaultLocale, showShareButton, siteOrigin } = ui;
  const photos = listing.photos ?? [];
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
  const price = formatDarkPriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const description = listing.description?.trim() ?? "";
  const offerLabel = isSale ? dict.listing.sale : dict.listing.rent;
  const locationLine = listing.location_label || typeLabel;

  return (
    <DarkShell content={content} locale={locale} dict={dict} floatRaised>
      <DarkHeader ui={ui} session={session} />

      <main className="dark-detail">
        <div className="dark-shell dark-detail__wrap">
          <header className="dark-detail__head">
            <DarkReveal variant="up" durationMs={700}>
              <Link href={backHref} className="dark-detail__back">
                <DarkIconArrowLeft className="h-4 w-4" />
                {dict.listing.back}
              </Link>
            </DarkReveal>

            <DarkReveal variant="up" durationMs={800} className="dark-detail__identity">
              <div className="dark-detail__identity-head">
                <p className="dark-detail__location">{locationLine}</p>
                {showShareButton ? (
                  <div className="dark-share">
                    <ListingShareButton
                      url={listingUrl}
                      title={listing.title}
                      label={dict.listing.share}
                      copyLabel={dict.listing.shareCopy}
                      copiedLabel={dict.listing.shareCopied}
                      failedLabel={dict.listing.shareFailed}
                      closeLabel={dict.listing.shareClose}
                      className="dark-share-button"
                    />
                  </div>
                ) : null}
              </div>
              <h1 className="dark-detail__title">
                {displayListingTitle(listing.title) || listing.title}
              </h1>
            </DarkReveal>
          </header>

          <div className="dark-detail__layout">
            <div className="dark-detail__main">
              <div className="dark-detail__gallery">
                <div className="dark-gallery-wrap">
                  <ListingPhotoGallery
                    variant="strip"
                    title={listing.title}
                    photos={photos}
                    fallbackUrl={listing.photo_url}
                    labels={dict.listing.gallery}
                    locale={locale}
                    stripChrome={dict.listing.gallery}
                    portalSiteTheme="dark"
                  />
                  <span className="dark-gallery__badge">{offerLabel}</span>
                </div>
              </div>

              {specs.length > 0 ? (
                <dl className="dark-detail__specs">
                  {specs.map((spec) => {
                    const Icon = specIcon(spec.key);
                    return (
                      <div key={spec.key} className="dark-detail__spec">
                        <dt>
                          <Icon className="dark-detail__spec-icon" />
                          {dict.listing.specs[spec.key]}
                        </dt>
                        <dd>{spec.value}</dd>
                      </div>
                    );
                  })}
                </dl>
              ) : null}

              {description ? (
                <section className="dark-detail__copy">
                  <h2>{dict.listing.description}</h2>
                  <div className="dark-detail__prose">{description}</div>
                </section>
              ) : null}
            </div>

            <div className="dark-detail__side">
              <aside className="dark-detail__panel">
                <div className="dark-detail__price-block">
                  <p className="dark-detail__price">
                    <span className="dark-detail__price-amount">
                      {price.amount}
                    </span>
                    <span className="dark-detail__price-unit">
                      {price.currency}
                      {offerType === "rent" ? ` ${dict.listing.perMonth}` : ""}
                    </span>
                  </p>
                </div>

                <div id="inquiry" className="dark-detail__inquiry">
                  <div className="dark-detail__inquiry-intro">
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
                      className="dark-btn dark-detail__whatsapp"
                      ariaLabel={`${isSale ? dict.inquiry.whatsappSale : dict.inquiry.whatsappRent}. ${dict.a11y.opensInNewTab}`}
                      icon={<DarkIconWhatsApp className="h-5 w-5" />}
                    />
                  ) : null}
                  {listing.contact_phone ? (
                    <p className="dark-detail__or">
                      {dict.listing.orLeaveDetails}
                    </p>
                  ) : null}
                  <ListingInquiryForm
                    slug={listing.slug}
                    offerType={offerType}
                    copy={dict.inquiry}
                    inputIdPrefix="dark-inquiry"
                    classNames={{
                      form: "dark-inquiry",
                      label: "dark-search__label",
                      control: "dark-field",
                      textarea: "dark-field dark-field--area",
                      error: "dark-inquiry__error",
                      success: "dark-form-hint",
                      submit: "dark-btn dark-form-submit",
                    }}
                  />
                </div>
              </aside>

              <section className="dark-detail__place">
                {hasPlace ? (
                  <>
                    <div className="dark-detail__place-head">
                      <h2>{dict.listing.location}</h2>
                      {listing.latitude != null && listing.longitude != null ? (
                        <a
                          href={googleMapsSearchUrl(
                            listing.latitude,
                            listing.longitude,
                          )}
                          aria-label={`${dict.listing.viewMap}. ${dict.a11y.opensInNewTab}`}
                          className="dark-soft-btn"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DarkIconExternal className="h-3.5 w-3.5" />
                          {dict.listing.viewMap}
                        </a>
                      ) : null}
                    </div>
                    <div className="dark-detail__address">
                      <span className="dark-detail__address-icon" aria-hidden>
                        <DarkIconMapPin className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="dark-detail__agency">{agency}</p>
                        {listing.address_label ? (
                          <p>{listing.address_label}</p>
                        ) : null}
                      </div>
                    </div>
                  </>
                ) : null}
                <p className="dark-detail__listed">
                  {dict.listing.listedBy}: <strong>{agency}</strong>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <div className="dark-detail__mobile-cta">
        <a href="#inquiry" className="dark-btn">
          {listing.contact_phone
            ? dict.listing.mobileCtaWithPhone
            : dict.listing.mobileCta}
        </a>
      </div>

      <DarkFooter ui={ui} />
    </DarkShell>
  );
}
