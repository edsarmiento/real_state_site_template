import Link from "next/link";
import {
  listingPublicSpecsLocalized,
  publicListingCardModel,
  type ListingSpecKey,
  type PublicListingCard,
} from "@/lib/listing-types";
import { fillTemplate, type SiteDictionary, type SiteLocale } from "@/lib/site-i18n";
import { YellowCoverImage } from "@/themes/yellow/yellow-cover-image";
import { displayListingTitle } from "@/themes/yellow/yellow-display";
import {
  YellowIconArrowRight,
  YellowIconBath,
  YellowIconBed,
  YellowIconMapPin,
  YellowIconRuler,
} from "@/themes/yellow/yellow-icons";
import { YellowReveal } from "@/themes/yellow/yellow-reveal";
import { formatYellowPriceParts } from "@/themes/yellow/yellow-ui";

type Props = {
  listing: PublicListingCard;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  index?: number;
};

function specIcon(key: ListingSpecKey) {
  if (key === "bedrooms") return <YellowIconBed className="yellow-card__icon" />;
  if (key === "bathrooms") return <YellowIconBath className="yellow-card__icon" />;
  return <YellowIconRuler className="yellow-card__icon" />;
}

export function YellowListingCard({
  listing,
  locale,
  defaultLocale,
  dict,
  index = 0,
}: Props) {
  const { href, suffix, specLine, offerLabel } = publicListingCardModel(
    listing,
    { dict, locale, defaultLocale },
  );
  const price = formatYellowPriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const title = displayListingTitle(listing.title) || listing.title;
  const specs = listingPublicSpecsLocalized(listing, dict);

  return (
    <YellowReveal variant="up" delayMs={(index % 3) * 80}>
      <Link
        href={href}
        className="yellow-card group"
        aria-label={fillTemplate(dict.listing.viewPropertyAria, {
          title: listing.title,
        })}
      >
        <div className="yellow-card__media">
          <YellowCoverImage
            src={listing.photo_url}
            alt={listing.title}
            className="yellow-img-zoom h-full w-full object-cover"
            placeholderClassName="yellow-card__placeholder"
            placeholder={dict.listing.noPhoto}
          />
          <span className="yellow-card__badge">{offerLabel}</span>
        </div>
        <div className="yellow-card__body">
          <div className="yellow-card__price-row">
            <p className="yellow-card__price">
              {price.amount}{" "}
              <span className="yellow-card__price-unit">
                {price.currency}
                {suffix ? ` ${suffix}` : ""}
              </span>
            </p>
            <span className="yellow-card__offer">{offerLabel}</span>
          </div>
          <h3 className="yellow-card__title" title={listing.title}>
            <span className="line-clamp-2">{title}</span>
          </h3>
          {listing.location_label ? (
            <p className="yellow-card__location">
              <YellowIconMapPin className="yellow-card__icon" />
              <span className="line-clamp-1">{listing.location_label}</span>
            </p>
          ) : null}
          {specs.length > 0 ? (
            <div className="yellow-card__specs">
              {specs.map((spec) => (
                <span key={spec.key}>
                  {specIcon(spec.key)}
                  {spec.value}
                </span>
              ))}
            </div>
          ) : specLine ? (
            <p className="yellow-card__specs">{specLine}</p>
          ) : null}
          <span className="yellow-card__cta" aria-hidden="true">
            {dict.listing.viewProperty}
            <YellowIconArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </YellowReveal>
  );
}
