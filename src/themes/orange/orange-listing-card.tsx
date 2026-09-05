import Link from "next/link";
import { parseOfferType, type PublicListingCard } from "@/lib/listing-types";
import {
  fillTemplate,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { OrangeCoverImage } from "@/themes/orange/orange-cover-image";
import {
  OrangeIconBath,
  OrangeIconBed,
  OrangeIconHome,
  OrangeIconMaximize,
} from "@/themes/orange/orange-icons";
import { OrangeShareButton } from "@/themes/orange/orange-share-button";
import { formatOrangePriceParts } from "@/themes/orange/orange-ui";
import { orangeVisibleSpecs } from "@/themes/orange/orange-listing-specs";

type Props = {
  listing: PublicListingCard;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  shareLabel: string;
  shareCopied: string;
};

function specIcon(key: string) {
  if (key === "bedrooms") return <OrangeIconBed className="h-3.5 w-3.5" />;
  if (key === "bathrooms") return <OrangeIconBath className="h-3.5 w-3.5" />;
  if (key === "land" || key === "built") {
    return <OrangeIconMaximize className="h-3.5 w-3.5" />;
  }
  return <OrangeIconHome className="h-3.5 w-3.5" />;
}

export function OrangeListingCard({
  listing,
  locale,
  defaultLocale,
  dict,
  shareLabel,
  shareCopied,
}: Props) {
  const offerType = parseOfferType(listing.offer_type);
  const href = localizedHref(
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
  const typeLabel =
    dict.propertyTypes[
      listing.property_type as keyof typeof dict.propertyTypes
    ] ?? listing.property_type;
  const specs = orangeVisibleSpecs(listing).slice(0, 3);
  const title = listing.title;

  return (
    <article className="orange-card">
      <Link
        href={href}
        className="orange-card__media"
        aria-label={fillTemplate(dict.listing.viewPropertyAria, { title })}
      >
        <OrangeCoverImage
          src={listing.photo_url}
          alt={title}
          className="orange-card__image"
          placeholderClassName="orange-card__placeholder"
          placeholder={dict.listing.noPhoto}
        />
        <span className="orange-card__badges">
          <span className="orange-card__badge orange-card__badge--offer">
            {offerType === "sale" ? dict.listing.sale : dict.listing.rent}
          </span>
          <span className="orange-card__badge orange-card__badge--type">
            {typeLabel}
          </span>
        </span>
        <span className="orange-card__price">
          {price.amount}
          <span>
            {price.currency}
            {offerType === "rent" ? ` ${dict.listing.perMonth}` : ""}
          </span>
        </span>
      </Link>
      <div className="orange-card__body">
        <div className="orange-card__headline">
          {listing.location_label ? (
            <p className="orange-card__location">{listing.location_label}</p>
          ) : null}
          <h3 className="orange-card__title">
            <Link href={href}>{title}</Link>
          </h3>
        </div>
        {specs.length > 0 ? (
          <dl className="orange-card__specs">
            {specs.map((spec) => (
              <div key={spec.key}>
                <dt>
                  <span aria-hidden>{specIcon(spec.key)}</span>
                  {dict.listing.specs[spec.key]}
                </dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="orange-card__actions">
          <Link href={href} className="orange-soft-btn">
            {dict.listing.viewProperty}
          </Link>
          <OrangeShareButton
            slug={listing.slug}
            title={title}
            path={href}
            label={shareLabel}
            copiedLabel={shareCopied}
          />
        </div>
      </div>
    </article>
  );
}
