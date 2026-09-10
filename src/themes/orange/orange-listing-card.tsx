import Link from "next/link";
import {
  listingPublicSpecsLocalized,
  publicListingCardModel,
  type PublicListingCard,
} from "@/lib/listing-types";
import {
  fillTemplate,
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
  const { href, suffix, typeLabel, offerLabel } = publicListingCardModel(
    listing,
    { dict, locale, defaultLocale },
  );
  const price = formatOrangePriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const specs = listingPublicSpecsLocalized(listing, dict).slice(0, 3);
  const title = listing.title;

  return (
    <article className="orange-card public-listing-card">
      <Link
        href={href}
        className="orange-card__media public-listing-card__media"
        aria-label={fillTemplate(dict.listing.viewPropertyAria, { title })}
      >
        <OrangeCoverImage
          src={listing.photo_url}
          alt={title}
          className="orange-card__image"
          placeholderClassName="orange-card__placeholder public-listing-card__placeholder"
          placeholder={dict.listing.noPhoto}
        />
        <span className="orange-card__badges">
          <span className="orange-card__badge orange-card__badge--offer">
            {offerLabel}
          </span>
          <span className="orange-card__badge orange-card__badge--type">
            {typeLabel}
          </span>
        </span>
        <span className="orange-card__price public-listing-card__price">
          {price.amount}
          <span>
            {price.currency}
            {suffix ? ` ${suffix.trim()}` : ""}
          </span>
        </span>
      </Link>
      <div className="orange-card__body public-listing-card__body">
        <div className="orange-card__headline">
          {listing.location_label ? (
            <p className="orange-card__location public-listing-card__location">
              {listing.location_label}
            </p>
          ) : null}
          <h3 className="orange-card__title public-listing-card__title">
            <Link href={href}>{title}</Link>
          </h3>
        </div>
        {specs.length > 0 ? (
          <dl className="orange-card__specs public-listing-card__specifications">
            {specs.map((spec) => (
              <div key={spec.key}>
                <dt>
                  <span aria-hidden>{specIcon(spec.key)}</span>
                  {spec.label}
                </dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="orange-card__actions">
          <Link href={href} className="orange-soft-btn public-listing-card__cta">
            {dict.listing.viewProperty}
          </Link>
          <OrangeShareButton
            url={href}
            title={title}
            label={shareLabel}
            copiedLabel={shareCopied}
            copyLabel={dict.listing.shareCopy}
            failedLabel={dict.listing.shareFailed}
            closeLabel={dict.listing.shareClose}
          />
        </div>
      </div>
    </article>
  );
}
