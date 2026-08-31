import Link from "next/link";
import { ListingPhotoGallery } from "@/components/listing-photo-gallery";
import { parseOfferType } from "@/lib/listing-types";
import { localizedHref } from "@/lib/site-i18n";
import type { ListingDetailThemeProps } from "@/themes/theme-types";
import { LuxuryButton } from "@/themes/luxury/luxury-button";
import { LuxuryFooter } from "@/themes/luxury/luxury-footer";
import { LuxuryHeader } from "@/themes/luxury/luxury-header";
import { LuxuryInquiryForm } from "@/themes/luxury/luxury-inquiry-form";
import {
  LuxuryIconArea,
  LuxuryIconArrowLeft,
  LuxuryIconBath,
  LuxuryIconBedrooms,
  LuxuryIconHome,
  LuxuryIconLocation,
} from "@/themes/luxury/luxury-icons";
import { LuxuryListingDescription } from "@/themes/luxury/luxury-listing-description";
import { LuxuryListingTitle } from "@/themes/luxury/luxury-listing-title";
import { LuxuryListingWhatsAppButton } from "@/themes/luxury/luxury-listing-whatsapp";
import { LuxuryLogo } from "@/themes/luxury/luxury-logo";
import { LuxuryMapsButton } from "@/themes/luxury/luxury-maps-button";
import { luxuryVisibleSpecs } from "@/themes/luxury/luxury-specs";
import { LuxuryPrice } from "@/themes/luxury/luxury-price";
import { LuxuryShell } from "@/themes/luxury/luxury-shell";
import { getLuxuryUi } from "@/themes/luxury/luxury-ui";

function specIcon(key: string) {
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
  const { content, dict, locale, defaultLocale } = await getLuxuryUi(lang);
  const photos = listing.photos ?? [];
  const offerType = parseOfferType(listing.offer_type);
  const priceSuffix = offerType === "rent" ? dict.listing.perMonth : null;
  const specs = luxuryVisibleSpecs(listing);
  const typeLabel =
    dict.propertyTypes[
      listing.property_type as keyof typeof dict.propertyTypes
    ] ?? listing.property_type;
  const isSale = offerType === "sale";
  const agency = listing.agency_name || content.brand.name;
  const hasMap = listing.latitude != null && listing.longitude != null;
  const hasLocation = Boolean(listing.address_label) || hasMap;
  const backHref = localizedHref("/#catalogo", locale, null, defaultLocale);

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
                <LuxuryListingWhatsAppButton
                  phone={listing.contact_phone}
                  title={listing.title}
                  slug={listing.slug}
                  offerType={offerType}
                  locale={locale}
                  defaultLocale={defaultLocale}
                  dict={dict}
                />
              </div>
            ) : null}
            {listing.contact_phone ? (
              <div className="luxury-inquiry__separator" aria-hidden>
                <span>{dict.listing.orLeaveDetails}</span>
              </div>
            ) : null}
            <div className="luxury-inquiry__form">
              <LuxuryInquiryForm
                slug={listing.slug}
                offerType={offerType}
                dict={dict}
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