import Link from "next/link";
import { ListingInquiryForm } from "@/components/listing-inquiry-form";
import { ListingPhotoGallery } from "@/components/listing-photo-gallery";
import { ListingShareButton } from "@/components/listing-share-button";
import { ListingWhatsAppButton } from "@/components/listing-whatsapp-button";
import { OpenInMapsLink } from "@/components/open-in-maps-link";
import {
  listingPublicSpecsLocalized,
  parseOfferType,
} from "@/lib/listing-types";
import { localizedPropertyTypeLabel } from "@/lib/property-labels";
import { listingPublicUrl } from "@/lib/site-config-env";
import { localizedHref, localizeSiteHref } from "@/lib/site-i18n";
import type { ListingDetailThemeRouteProps } from "@/themes/theme-types";
import { ElegantFooter } from "@/themes/elegant/elegant-footer";
import { ElegantHeader } from "@/themes/elegant/elegant-header";
import { ElegantIconArrowLeft, ElegantIconWhatsApp } from "@/themes/elegant/elegant-icons";
import { ElegantShell } from "@/themes/elegant/elegant-shell";
import { formatElegantPriceParts, getElegantUi } from "@/themes/elegant/elegant-ui";

export async function ElegantListingDetail({
  listing,
  lang,
}: ListingDetailThemeRouteProps) {
  const {
    content,
    dict,
    locale,
    defaultLocale,
    showShareButton,
    siteOrigin,
  } = await getElegantUi(lang);
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
  const price = formatElegantPriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const description = listing.description?.trim() ?? "";
  const offerLabel = isSale ? dict.listing.sale : dict.listing.rent;

  return (
    <ElegantShell floatRaised lang={lang}>
      <ElegantHeader lang={lang} />
      <main className="elegant-detail">
        <div className="elegant-shell elegant-detail__wrap">
          <Link href={backHref} className="elegant-detail__back">
            <ElegantIconArrowLeft className="h-4 w-4" />
            {dict.listing.back}
          </Link>

          <div className="elegant-detail__mast">
            <div>
              <p className="elegant-kicker">
                {listing.location_label || typeLabel}
              </p>
              <h1 className="elegant-detail__title">{listing.title}</h1>
            </div>
            {showShareButton ? (
              <div className="elegant-share-wrap">
                <ListingShareButton
                  url={listingUrl}
                  title={listing.title}
                  label={dict.listing.share}
                  copyLabel={dict.listing.shareCopy}
                  copiedLabel={dict.listing.shareCopied}
                  failedLabel={dict.listing.shareFailed}
                  closeLabel={dict.listing.shareClose}
                  className="elegant-share"
                />
              </div>
            ) : null}
          </div>

          <div className="elegant-detail__columns">
            <div className="elegant-detail__main">
              <div className="elegant-gallery-wrap">
                <ListingPhotoGallery
                  title={listing.title}
                  photos={photos}
                  fallbackUrl={listing.photo_url}
                  className="elegant-gallery"
                  styledLayout={false}
                  labels={dict.listing.gallery}
                />
                <span className="elegant-gallery__badge">{offerLabel}</span>
              </div>
              {description ? (
                <section className="elegant-panel">
                  <h2>{dict.listing.description}</h2>
                  <div className="elegant-detail__prose">{description}</div>
                </section>
              ) : null}
            </div>

            <aside className="elegant-detail__aside">
              <div className="elegant-panel">
                <p className="elegant-detail__price">
                  {price.amount}{" "}
                  <span>
                    {price.currency}
                    {offerType === "rent" ? ` ${dict.listing.perMonth}` : ""}
                  </span>
                </p>
                {specs.length > 0 ? (
                  <dl className="elegant-detail__specs">
                    {specs.map((spec) => (
                      <div key={spec.key}>
                        <dt>{spec.label}</dt>
                        <dd>{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>

              <div id="inquiry" className="elegant-panel">
                <h2>
                  {isSale ? dict.listing.inquireSale : dict.listing.inquireRent}
                </h2>
                <p className="elegant-muted">
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
                    className="elegant-btn elegant-btn--gold elegant-btn--full"
                    ariaLabel={`${isSale ? dict.inquiry.whatsappSale : dict.inquiry.whatsappRent}. ${dict.a11y.opensInNewTab}`}
                    icon={<ElegantIconWhatsApp className="h-4 w-4" />}
                  />
                ) : null}
                {listing.contact_phone ? (
                  <p className="elegant-detail__or">{dict.listing.orLeaveDetails}</p>
                ) : null}
                <ListingInquiryForm
                  slug={listing.slug}
                  offerType={offerType}
                  styledLayout={false}
                  copy={dict.inquiry}
                  inputIdPrefix="elegant-inquiry"
                  privacy={{
                    href: localizeSiteHref(
                      content.legal.privacyNoticeUrl,
                      locale,
                      defaultLocale,
                    ),
                    consentLabel: dict.contact.privacyConsent,
                    linkLabel: dict.contact.privacyLink,
                    error: dict.contact.privacyConsent,
                  }}
                  classNames={{
                    form: "elegant-inquiry",
                    label: "elegant-search__label",
                    control: "elegant-field",
                    textarea: "elegant-field",
                    error: "elegant-inquiry__error",
                    success: "elegant-inquiry__success",
                    submit: "elegant-btn elegant-btn--gold elegant-btn--full",
                    consent: "elegant-form-consent",
                  }}
                />
              </div>

              {hasPlace ? (
                <section className="elegant-panel">
                  <h2>{dict.listing.location}</h2>
                  {hasMap ? (
                    <OpenInMapsLink
                      latitude={listing.latitude!}
                      longitude={listing.longitude!}
                      label={listing.address_label ?? listing.location_label}
                      showCoordinates={false}
                      linkText={dict.listing.viewMap}
                      className="elegant-btn elegant-btn--ghost"
                    />
                  ) : null}
                  <p className="elegant-detail__agency">{agency}</p>
                  {listing.address_label ? <p>{listing.address_label}</p> : null}
                  <p className="elegant-muted">
                    {dict.listing.listedBy}: {agency}
                  </p>
                </section>
              ) : (
                <p className="elegant-muted">
                  {dict.listing.listedBy}: {agency}
                </p>
              )}
            </aside>
          </div>
        </div>
      </main>
      <ElegantFooter lang={lang} />
    </ElegantShell>
  );
}
