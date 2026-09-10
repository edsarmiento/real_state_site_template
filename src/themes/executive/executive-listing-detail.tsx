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
import { localizedHref } from "@/lib/site-i18n";
import type { ListingDetailThemeProps } from "@/themes/theme-types";
import { formatExecutivePriceParts } from "@/themes/executive/executive-brand";
import { ExecutiveFooter } from "@/themes/executive/executive-footer";
import { ExecutiveHeader } from "@/themes/executive/executive-header";
import {
  ExecutiveIconArrowLeft,
  ExecutiveIconBath,
  ExecutiveIconBed,
  ExecutiveIconHome,
  ExecutiveIconMapPin,
  ExecutiveIconRuler,
  ExecutiveIconWhatsApp,
} from "@/themes/executive/executive-icons";
import { ExecutiveShell } from "@/themes/executive/executive-shell";
import { getExecutiveUi } from "@/themes/executive/executive-ui";

function SpecIcon({ specKey }: { specKey: string }) {
  if (specKey === "bedrooms") return <ExecutiveIconBed className="h-4 w-4" />;
  if (specKey === "bathrooms") return <ExecutiveIconBath className="h-4 w-4" />;
  if (specKey === "land") return <ExecutiveIconRuler className="h-4 w-4" />;
  return <ExecutiveIconHome className="h-4 w-4" />;
}

export async function ExecutiveListingDetail({
  listing,
  lang,
}: ListingDetailThemeProps) {
  const { content, dict, copy, locale, defaultLocale, showShareButton, siteOrigin } =
    await getExecutiveUi(lang);
  const photos = listing.photos ?? [];
  const offerType = parseOfferType(listing.offer_type);
  const specs = listingPublicSpecsLocalized(listing, dict);
  const typeLabel = localizedPropertyTypeLabel(dict, listing.property_type);
  const isSale = offerType === "sale";
  const agency = listing.agency_name || content.brand.name;
  const hasMap = listing.latitude != null && listing.longitude != null;
  const hasPlace =
    Boolean(listing.address_label?.trim()) ||
    Boolean(listing.location_label?.trim()) ||
    hasMap;
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
  const price = formatExecutivePriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const description = listing.description?.trim() ?? "";
  const offerLabel = isSale ? dict.listing.sale : dict.listing.rent;

  return (
    <ExecutiveShell lang={lang}>
      <ExecutiveHeader lang={lang} />
      <main className="executive-detail">
        <div className="executive-shell executive-detail__wrap">
          <Link href={backHref} className="executive-back">
            <ExecutiveIconArrowLeft className="h-3.5 w-3.5" />
            {dict.listing.back}
          </Link>

          <div className="executive-detail__grid">
            <div className="executive-detail__main">
              <div className="executive-gallery-card">
                <div className="executive-gallery-wrap">
                  <ListingPhotoGallery
                    title={listing.title}
                    photos={photos}
                    fallbackUrl={listing.photo_url}
                    className="executive-gallery"
                    styledLayout={false}
                    labels={dict.listing.gallery}
                  />
                  <span className="executive-gallery__badge">{offerLabel}</span>
                </div>
              </div>

              <div className="executive-identity">
                <div className="executive-identity__head">
                  <p className="executive-kicker">
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
                      className="executive-share"
                    />
                  ) : null}
                </div>
                <h1 className="executive-detail__title">{listing.title}</h1>
              </div>

              {specs.length > 0 ? (
                <dl className="executive-detail__specs">
                  {specs.map((spec) => (
                    <div key={spec.key} className="executive-spec">
                      <dt>{dict.listing.specs[spec.key]}</dt>
                      <dd>
                        <SpecIcon specKey={spec.key} />
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {description ? (
                <section className="executive-description">
                  <h2>{dict.listing.description}</h2>
                  <div className="executive-description__body">{description}</div>
                </section>
              ) : null}
            </div>

            <aside className="executive-detail__aside">
              <div id="inquiry" className="executive-inquiry-card">
                <p className="executive-kicker">
                  {isSale ? dict.listing.inquireSale : dict.listing.inquireRent}
                </p>
                <h2>
                  {isSale
                    ? dict.listing.inquireSaleCopy
                    : dict.listing.inquireRentCopy}
                </h2>
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
                    className="executive-whatsapp-cta executive-whatsapp-cta--block"
                    ariaLabel={`${isSale ? dict.inquiry.whatsappSale : dict.inquiry.whatsappRent}. ${dict.a11y.opensInNewTab}`}
                    icon={<ExecutiveIconWhatsApp className="h-5 w-5" />}
                  />
                ) : null}
                {listing.contact_phone ? (
                  <p className="executive-inquiry-or">{dict.listing.orLeaveDetails}</p>
                ) : null}
                <ListingInquiryForm
                  slug={listing.slug}
                  offerType={offerType}
                  styledLayout={false}
                  copy={dict.inquiry}
                  inputIdPrefix="executive-inquiry"
                  classNames={{
                    form: "executive-inquiry",
                    label: "executive-search__label",
                    control: "executive-field",
                    textarea: "executive-field",
                    error: "executive-inquiry__error",
                    success: "executive-inquiry__success",
                    submit: "executive-search__submit",
                  }}
                />
              </div>

              <div className="executive-price-card">
                <p className="executive-kicker">{copy.investmentPrice}</p>
                <p className="executive-price-card__value">
                  {price.amount}{" "}
                  <span>
                    {price.currency}
                    {offerType === "rent" ? ` ${dict.listing.perMonth}` : ""}
                  </span>
                </p>
              </div>

              <div className="executive-place-card">
                <div className="executive-place-card__head">
                  <h2>{dict.listing.location}</h2>
                  {listing.latitude != null && listing.longitude != null ? (
                    <OpenInMapsLink
                      latitude={listing.latitude}
                      longitude={listing.longitude}
                      label={listing.title}
                      showCoordinates={false}
                      linkText={dict.listing.viewMap}
                      className="executive-map-btn"
                    />
                  ) : null}
                </div>
                {hasPlace ? (
                  <div className="executive-place-card__address">
                    <span className="executive-place-card__icon" aria-hidden>
                      <ExecutiveIconMapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="executive-place-card__agency">{agency}</p>
                      {listing.address_label ? (
                        <p>{listing.address_label}</p>
                      ) : listing.location_label ? (
                        <p>{listing.location_label}</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                <p className="executive-place-card__listed">
                  {dict.listing.listedBy}: <strong>{agency}</strong>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <ExecutiveFooter lang={lang} />
    </ExecutiveShell>
  );
}
