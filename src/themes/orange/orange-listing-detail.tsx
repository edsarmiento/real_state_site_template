import Link from "next/link";
import type { CSSProperties } from "react";
import { parseOfferType } from "@/lib/listing-types";
import { localizedHref } from "@/lib/site-i18n";
import type { ListingDetailThemeProps } from "@/themes/theme-types";
import { orangeVisibleSpecs } from "@/themes/orange/orange-listing-specs";
import { OrangeFooter } from "@/themes/orange/orange-footer";
import { OrangeGallery } from "@/themes/orange/orange-gallery";
import { OrangeHeader } from "@/themes/orange/orange-header";
import {
  OrangeIconArrowLeft,
  OrangeIconBath,
  OrangeIconBed,
  OrangeIconHome,
  OrangeIconLocation,
  OrangeIconMaximize,
} from "@/themes/orange/orange-icons";
import { OrangeInquiryForm } from "@/themes/orange/orange-inquiry-form";
import { OrangeListingDescription } from "@/themes/orange/orange-listing-description";
import { OrangeLogo } from "@/themes/orange/orange-logo";
import { OrangeMapsButton } from "@/themes/orange/orange-maps-button";
import { OrangeReveal } from "@/themes/orange/orange-reveal";
import { OrangeShareButton } from "@/themes/orange/orange-share-button";
import { OrangeShell } from "@/themes/orange/orange-shell";
import { formatOrangePriceParts, getOrangeUi } from "@/themes/orange/orange-ui";
import { OrangeListingWhatsAppButton } from "@/themes/orange/orange-whatsapp-button";

function specIcon(key: string) {
  if (key === "bedrooms") return <OrangeIconBed />;
  if (key === "bathrooms") return <OrangeIconBath />;
  if (key === "land" || key === "built") return <OrangeIconMaximize />;
  return <OrangeIconHome />;
}

export function OrangeListingDetail({
  listing,
  lang,
  content,
  config,
  locale,
}: ListingDetailThemeProps) {
  const { dict, copy, defaultLocale } = getOrangeUi({ content, config, locale });
  const photos = listing.photos ?? [];
  const offerType = parseOfferType(listing.offer_type);
  const specs = orangeVisibleSpecs(listing);
  const typeLabel =
    dict.propertyTypes[
      listing.property_type as keyof typeof dict.propertyTypes
    ] ?? listing.property_type;
  const isSale = offerType === "sale";
  const agency = listing.agency_name || content.brand.name;
  const hasMap = listing.latitude != null && listing.longitude != null;
  const hasLocation = Boolean(listing.address_label) || hasMap;
  const backHref = localizedHref("/#catalogo", locale, null, defaultLocale);
  const listingPath = localizedHref(
    `/inmueble/${listing.slug}`,
    locale,
    null,
    defaultLocale,
  );
  const price = formatOrangePriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );

  return (
    <OrangeShell floatRaised lang={lang}>
      <OrangeHeader lang={lang} />

      <main className="orange-detail">
        <OrangeReveal>
          <Link href={backHref} className="orange-back">
            <OrangeIconArrowLeft className="h-4 w-4" />
            {dict.listing.back}
          </Link>
        </OrangeReveal>

        <div className="orange-detail__grid">
          <article className="orange-detail__article">
            <OrangeReveal variant="left">
              <OrangeGallery
                title={listing.title}
                photos={photos}
                fallbackUrl={listing.photo_url}
                dict={dict}
              />
            </OrangeReveal>

            <OrangeReveal>
            <header className="orange-detail__masthead">
              <div className="orange-detail__badges">
                <span className="orange-pill orange-pill--terracotta">
                  {isSale ? dict.listing.sale : dict.listing.rent}
                </span>
                <span className="orange-pill orange-pill--charcoal">
                  {typeLabel}
                </span>
              </div>
              {listing.location_label ? (
                <p className="orange-detail__location">
                  {listing.location_label}
                </p>
              ) : null}
              <h1 className="orange-detail__title">{listing.title}</h1>
              <div className="orange-detail__price-row">
                <p className="orange-detail__price">
                  {price.amount}
                  <span>
                    {price.currency}
                    {offerType === "rent" ? ` ${dict.listing.perMonth}` : ""}
                  </span>
                </p>
                <OrangeShareButton
                  url={listingPath}
                  title={listing.title}
                  label={copy.share}
                  copiedLabel={copy.shareCopied}
                  copyLabel={dict.listing.shareCopy}
                  failedLabel={dict.listing.shareFailed}
                  closeLabel={dict.listing.shareClose}
                />
              </div>
            </header>
            </OrangeReveal>

            {specs.length > 0 ? (
              <OrangeReveal>
              <dl className="orange-specs">
                {specs.map((spec) => (
                  <div key={spec.key} className="orange-specs__item">
                    <dt>
                      <span className="orange-specs__icon" aria-hidden>
                        {specIcon(spec.key)}
                      </span>
                      {dict.listing.specs[spec.key]}
                    </dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
              </OrangeReveal>
            ) : null}

            <OrangeReveal>
              <OrangeListingDescription
                description={listing.description ?? ""}
                heading={dict.listing.description}
              />
            </OrangeReveal>

            <OrangeReveal>
            {hasLocation ? (
              <section className="orange-panel">
                <h2 className="orange-panel__label">{dict.listing.location}</h2>
                <div className="orange-location">
                  <span className="orange-location__icon" aria-hidden>
                    <OrangeIconLocation />
                  </span>
                  <div>
                    {listing.address_label ? (
                      <p>{listing.address_label}</p>
                    ) : null}
                    {listing.latitude != null && listing.longitude != null ? (
                      <OrangeMapsButton
                        latitude={listing.latitude}
                        longitude={listing.longitude}
                        label={listing.title}
                        linkText={dict.listing.viewMap}
                      />
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            <p className="orange-detail__agency">
              {content.brand.logoUrl && agency === content.brand.name ? (
                <OrangeLogo
                  src={content.brand.logoUrl}
                  alt=""
                  className="orange-detail__agency-logo"
                  fallbackClassName="sr-only"
                />
              ) : null}
              <span>
                {dict.listing.listedBy}{" "}
                <strong>{agency}</strong>
              </span>
            </p>
            </OrangeReveal>
          </article>

          {/* The attribute goes on the card itself: a wrapper would become the
              grid item and its `position: sticky` would stop working. */}
          <aside
            id="inquiry"
            className="orange-inquiry-card"
            data-orange-reveal="up"
            style={{ "--orange-reveal-delay": "100ms" } as CSSProperties}
          >
            <h2>
              {isSale ? dict.listing.inquireSale : dict.listing.inquireRent}
            </h2>
            <p>
              {isSale
                ? dict.listing.inquireSaleCopy
                : dict.listing.inquireRentCopy}
            </p>
            {listing.contact_phone ? (
              <OrangeListingWhatsAppButton
                phone={listing.contact_phone}
                title={listing.title}
                slug={listing.slug}
                offerType={offerType}
                locale={locale}
                defaultLocale={defaultLocale}
                dict={dict}
              />
            ) : null}
            {listing.contact_phone ? (
              <div className="orange-inquiry__separator" aria-hidden>
                <span>{dict.listing.orLeaveDetails}</span>
              </div>
            ) : null}
            <OrangeInquiryForm
              slug={listing.slug}
              offerType={offerType}
              dict={dict}
              locale={locale}
              defaultLocale={defaultLocale}
              privacyHref={content.legal.privacyNoticeUrl}
            />
          </aside>
        </div>
      </main>

      <div className="orange-mobile-cta">
        <a href="#inquiry" className="orange-btn orange-btn--dark orange-btn--full">
          {listing.contact_phone
            ? dict.listing.mobileCtaWithPhone
            : dict.listing.mobileCta}
        </a>
      </div>

      <OrangeFooter lang={lang} />
    </OrangeShell>
  );
}
