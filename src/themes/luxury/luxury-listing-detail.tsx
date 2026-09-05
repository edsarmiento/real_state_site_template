import Link from "next/link";
import { ListingInquiryForm } from "@/components/listing-inquiry-form";
import { ListingPhotoGallery } from "@/components/listing-photo-gallery";
import { ListingShareButton } from "@/components/listing-share-button";
import { ListingWhatsAppButton } from "@/components/listing-whatsapp-button";
import {
  listingPublicSpecsLocalized,
  parseOfferType,
  type ListingSpecKey,
} from "@/lib/listing-types";
import { localizedPropertyTypeLabel } from "@/lib/property-labels";
import { listingPublicUrl } from "@/lib/site-config-env";
import { localizedHref } from "@/lib/site-i18n";
import type { ListingDetailThemeProps } from "@/themes/theme-types";
import {
  LuxuryButton,
  luxuryButtonClassName,
} from "@/themes/luxury/luxury-button";
import { LuxuryFooter } from "@/themes/luxury/luxury-footer";
import { LuxuryHeader } from "@/themes/luxury/luxury-header";
import {
  LuxuryIconArea,
  LuxuryIconArrowLeft,
  LuxuryIconBath,
  LuxuryIconBedrooms,
  LuxuryIconHome,
  LuxuryIconLocation,
  LuxuryIconWhatsApp,
} from "@/themes/luxury/luxury-icons";
import { LuxuryListingDescription } from "@/themes/luxury/luxury-listing-description";
import { LuxuryListingTitle } from "@/themes/luxury/luxury-listing-title";
import { LuxuryLogo } from "@/themes/luxury/luxury-logo";
import { LuxuryMapsButton } from "@/themes/luxury/luxury-maps-button";
import { LuxuryPrice } from "@/themes/luxury/luxury-price";
import { LuxuryShell } from "@/themes/luxury/luxury-shell";
import { getLuxuryUi } from "@/themes/luxury/luxury-ui";

function specIcon(key: ListingSpecKey) {
  if (key === "bedrooms") return <LuxuryIconBedrooms />;
  if (key === "bathrooms") return <LuxuryIconBath />;
  if (key === "land" || key === "built") return <LuxuryIconArea />;
  return <LuxuryIconHome />;
}

function SpecValue({ value }: { value: string }) {
  const match = value.match(/^(.*?)\s+(m²)$/);
  if (!match) return <span className="luxury-specs__value">{value}</span>;
  return (
    <span className="luxury-specs__value">
      {match[1]}
      <span className="luxury-specs__unit">{match[2]}</span>
    </span>
  );
}

export async function LuxuryListingDetail({
  listing,
  lang,
}: ListingDetailThemeProps) {
  const { content, dict, locale, defaultLocale, showShareButton, siteOrigin } =
    await getLuxuryUi(lang);
  const photos = listing.photos ?? [];
  const offerType = parseOfferType(listing.offer_type);
  const priceSuffix = offerType === "rent" ? dict.listing.perMonth : null;
  const specs = listingPublicSpecsLocalized(listing, dict);
  const typeLabel = localizedPropertyTypeLabel(dict, listing.property_type);
  const isSale = offerType === "sale";
  const agency = listing.agency_name || content.brand.name;
  const hasMap = listing.latitude != null && listing.longitude != null;
  const hasLocation = Boolean(listing.address_label) || hasMap;
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
  const inquirySubmitClass = luxuryButtonClassName({
    variant: "gold",
    size: "md",
    surface: "light",
    fullWidth: true,
    loading: false,
  });
  const inquirySubmitPendingClass = luxuryButtonClassName({
    variant: "gold",
    size: "md",
    surface: "light",
    fullWidth: true,
    loading: true,
  });

  return (
    <LuxuryShell floatRaised lang={lang}>
      <LuxuryHeader lang={lang} />

      <main className="luxury-detail">
        <Link href={backHref} className="luxury-back">
          <LuxuryIconArrowLeft className="luxury-icon luxury-back__icon" />
          {dict.listing.back}
        </Link>

        <div className="luxury-gallery">
          <ListingPhotoGallery
            title={listing.title}
            photos={photos}
            fallbackUrl={listing.photo_url}
            className="listing-gallery"
            labels={dict.listing.gallery}
          />
        </div>

        <header className="luxury-detail__masthead">
          <div className="luxury-detail__kicker">
            <span className="luxury-detail__badge">
              {isSale ? dict.listing.sale : dict.listing.rent}
            </span>
            <span className="luxury-detail__type">{typeLabel}</span>
          </div>
          {listing.location_label ? (
            <p className="luxury-detail__location">{listing.location_label}</p>
          ) : null}
          <LuxuryListingTitle
            title={listing.title}
            as="h1"
            decorate={false}
            className="luxury-detail__title"
          />
          {showShareButton ? (
            <div className="luxury-detail__share">
              <ListingShareButton
                url={listingUrl}
                title={listing.title}
                label={dict.listing.share}
                copiedLabel={dict.listing.shareCopied}
                className="luxury-share-button"
              />
            </div>
          ) : null}
          <p className="luxury-detail__price">
            <LuxuryPrice
              cents={listing.rent_cents}
              currency={listing.currency}
              locale={locale}
              suffix={
                priceSuffix ? (
                  <span className="luxury-detail__suffix">{priceSuffix}</span>
                ) : null
              }
            />
          </p>
        </header>

        <div className="luxury-detail__body">
          <article className="luxury-detail__article">
            {specs.length > 0 ? (
              <dl className="luxury-specs">
                {specs.map((spec) => (
                  <div key={spec.key} className="luxury-specs__item">
                    <dt>
                      <span className="luxury-specs__icon" aria-hidden>
                        {specIcon(spec.key)}
                      </span>
                      {dict.listing.specs[spec.key]}
                    </dt>
                    <dd>
                      <SpecValue value={spec.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <LuxuryListingDescription
              description={listing.description ?? ""}
              heading={dict.listing.description}
            />

            {hasLocation ? (
              <section className="luxury-location-card">
                <span className="luxury-location-card__icon" aria-hidden>
                  <LuxuryIconLocation />
                </span>
                <div>
                  <h2 className="luxury-panel__label">{dict.listing.location}</h2>
                  {listing.address_label ? (
                    <p className="luxury-panel__prose">{listing.address_label}</p>
                  ) : null}
                  {listing.latitude != null && listing.longitude != null ? (
                    <div className="luxury-panel__map">
                      <LuxuryMapsButton
                        latitude={listing.latitude}
                        longitude={listing.longitude}
                        label={listing.title}
                        linkText={dict.listing.viewMap}
                      />
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            <p className="luxury-detail__agency">
              {content.brand.logoUrl && agency === content.brand.name ? (
                <LuxuryLogo
                  src={content.brand.logoUrl}
                  alt=""
                  className="luxury-detail__agency-logo"
                  fallbackClassName="sr-only"
                />
              ) : null}
              <span className="luxury-detail__agency-label">
                {dict.listing.listedBy}
              </span>
              <span className="luxury-detail__agency-name">{agency}</span>
            </p>
          </article>

          <aside id="inquiry" className="luxury-inquiry">
            <h2>
              {isSale ? dict.listing.inquireSale : dict.listing.inquireRent}
            </h2>
            <p>
              {isSale
                ? dict.listing.inquireSaleCopy
                : dict.listing.inquireRentCopy}
            </p>
            {listing.contact_phone ? (
              <div className="luxury-inquiry__whatsapp">
                <ListingWhatsAppButton
                  phone={listing.contact_phone}
                  title={listing.title}
                  listingUrl={listingUrl}
                  offerType={offerType}
                  saleLabel={dict.inquiry.whatsappSale}
                  rentLabel={dict.inquiry.whatsappRent}
                  messageTemplate={dict.inquiry.whatsappMessage}
                  unstyled
                  className="luxury-whatsapp-cta"
                  ariaLabel={`${isSale ? dict.inquiry.whatsappSale : dict.inquiry.whatsappRent}. ${dict.a11y.opensInNewTab}`}
                  icon={<LuxuryIconWhatsApp />}
                />
              </div>
            ) : null}
            {listing.contact_phone ? (
              <div className="luxury-inquiry__separator" aria-hidden>
                <span>{dict.listing.orLeaveDetails}</span>
              </div>
            ) : null}
            <div className="luxury-inquiry__form">
              <ListingInquiryForm
                slug={listing.slug}
                offerType={offerType}
                copy={dict.inquiry}
                inputIdPrefix="luxury-inquiry"
                classNames={{
                  form: "luxury-inquiry__fields",
                  field: "luxury-field",
                  label: "luxury-field__label",
                  control: "luxury-field__control",
                  textarea:
                    "luxury-field__control luxury-field__control--area",
                  error: "luxury-field__error",
                  success: "luxury-field__hint luxury-inquiry__success",
                  submit: inquirySubmitClass,
                  submitPending: inquirySubmitPendingClass,
                  submitLabel: "luxury-button__label",
                }}
              />
            </div>
          </aside>
        </div>
      </main>

      <div className="luxury-mobile-cta">
        <LuxuryButton href="#inquiry" variant="gold" fullWidth>
          {listing.contact_phone
            ? dict.listing.mobileCtaWithPhone
            : dict.listing.mobileCta}
        </LuxuryButton>
      </div>

      <LuxuryFooter lang={lang} />
    </LuxuryShell>
  );
}