import Link from "next/link";
import { parseListingDescriptionForDisplay } from "@/lib/listing-description";
import { parseOfferType } from "@/lib/listing-types";
import { googleMapsSearchUrl } from "@/lib/maps-links";
import { localizedHref } from "@/lib/site-i18n";
import type { ListingDetailThemeProps } from "@/themes/theme-types";
import { BeigeFooter } from "@/themes/beige/beige-footer";
import { BeigeGallery } from "@/themes/beige/beige-gallery";
import { BeigeHeader } from "@/themes/beige/beige-header";
import {
  BeigeIconArrowLeft,
  BeigeIconBath,
  BeigeIconBed,
  BeigeIconExternal,
  BeigeIconHome,
  BeigeIconMapPin,
  BeigeIconMaximize,
} from "@/themes/beige/beige-icons";
import { BeigeInquiryForm } from "@/themes/beige/beige-inquiry-form";
import { BeigeListingWhatsAppButton } from "@/themes/beige/beige-listing-whatsapp";
import { BeigeShell } from "@/themes/beige/beige-shell";
import { displayListingTitle } from "@/themes/beige/beige-display";
import { formatBeigePriceParts, getBeigeUi } from "@/themes/beige/beige-ui";
import { luxuryVisibleSpecs } from "@/themes/luxury/luxury-specs";

export async function BeigeListingDetail({
  listing,
  lang,
}: ListingDetailThemeProps) {
  const { content, dict, locale, defaultLocale } = await getBeigeUi(lang);
  const photos = listing.photos ?? [];
  const offerType = parseOfferType(listing.offer_type);
  const specs = luxuryVisibleSpecs(listing);
  const typeLabel =
    dict.propertyTypes[
      listing.property_type as keyof typeof dict.propertyTypes
    ] ?? listing.property_type;
  const isSale = offerType === "sale";
  const agency = listing.agency_name || content.brand.name;
  const hasMap = listing.latitude != null && listing.longitude != null;
  const backHref = localizedHref("/#catalogo", locale, null, defaultLocale);
  const price = formatBeigePriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const descriptionBlocks = parseListingDescriptionForDisplay(
    listing.description ?? "",
  );

  return (
    <BeigeShell floatRaised lang={lang}>
      <BeigeHeader lang={lang} />

      <main className="beige-detail">
        <div className="beige-shell beige-detail__wrap">
          <Link href={backHref} className="beige-detail__back">
            <BeigeIconArrowLeft className="h-4 w-4" />
            {dict.listing.back}
          </Link>

          <div className="beige-detail__grid">
            <div className="beige-detail__main">
              <BeigeGallery
                title={listing.title}
                photos={photos}
                fallbackUrl={listing.photo_url}
                offerLabel={isSale ? dict.listing.sale : dict.listing.rent}
                dict={dict}
              />

              <div className="beige-detail__panel">
                <div>
                  <p className="beige-eyebrow">
                    {listing.location_label || typeLabel}
                  </p>
                  <h1 className="beige-detail__title">
                    {displayListingTitle(listing.title) || listing.title}
                  </h1>
                  <p className="beige-detail__price">
                    {price.amount}{" "}
                    <span className="beige-detail__price-unit">
                      {price.currency}
                      {offerType === "rent" ? ` ${dict.listing.perMonth}` : ""}
                    </span>
                  </p>
                </div>

                {specs.length > 0 ? (
                  <dl className="beige-detail__specs">
                    {specs.map((spec) => (
                      <div key={spec.key} className="beige-detail__spec">
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

                {descriptionBlocks.length > 0 ? (
                  <section className="beige-detail__copy">
                    <h2>{dict.listing.description}</h2>
                    <div className="beige-detail__prose">
                      {descriptionBlocks.map((block, index) => {
                        if (block.type === "paragraph") {
                          return <p key={`p-${index}`}>{block.text}</p>;
                        }
                        if (block.type === "subheading") {
                          return (
                            <p key={`h-${index}`} className="beige-detail__subhead">
                              {block.text}
                            </p>
                          );
                        }
                        if (block.type === "callout") {
                          return (
                            <p key={`c-${index}`} className="beige-detail__callout">
                              {block.text}
                            </p>
                          );
                        }
                        if (block.type === "list") {
                          return (
                            <ul key={`l-${index}`}>
                              {block.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <p key={`t-${index}`} className="beige-detail__tags">
                            {block.tags.map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </p>
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {listing.address_label || hasMap ? (
                  <section className="beige-detail__place">
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
                  {dict.listing.listedBy}:{" "}
                  <strong>{agency}</strong>
                </p>
              </div>
            </div>

            <aside id="inquiry" className="beige-detail__aside">
              <div className="beige-detail__inquiry">
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
                  <BeigeListingWhatsAppButton
                    phone={listing.contact_phone}
                    title={listing.title}
                    slug={listing.slug}
                    offerType={offerType}
                    dict={dict}
                    className="beige-btn beige-detail__whatsapp"
                  />
                ) : null}
                {listing.contact_phone ? (
                  <p className="beige-detail__or">{dict.listing.orLeaveDetails}</p>
                ) : null}
                <BeigeInquiryForm
                  slug={listing.slug}
                  offerType={offerType}
                  dict={dict}
                  locale={locale}
                  defaultLocale={defaultLocale}
                  privacyHref={content.legal.privacyNoticeUrl}
                />
              </div>
            </aside>
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
