import Link from "next/link";
import {
  publicListingCardModel,
  type PublicListingCard,
} from "@/lib/listing-types";
import { fillTemplate, type SiteDictionary, type SiteLocale } from "@/lib/site-i18n";
import { BeigeCoverImage } from "@/themes/beige/beige-cover-image";
import { displayListingTitle } from "@/themes/beige/beige-display";
import {
  BeigeIconArrowRight,
  BeigeIconMapPin,
} from "@/themes/beige/beige-icons";
import { BeigeReveal } from "@/themes/beige/beige-reveal";
import { formatBeigePriceParts } from "@/themes/beige/beige-ui";

type Props = {
  listing: PublicListingCard;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  index?: number;
};

export function BeigeListingCard({
  listing,
  locale,
  defaultLocale,
  dict,
  index = 0,
}: Props) {
  const { href, suffix, typeLabel, specLine, offerLabel } =
    publicListingCardModel(listing, { dict, locale, defaultLocale });
  const price = formatBeigePriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const title = displayListingTitle(listing.title) || listing.title;

  return (
    <BeigeReveal variant="up" delayMs={(index % 3) * 100}>
      <Link
        href={href}
        className="beige-card group"
        aria-label={fillTemplate(dict.listing.viewPropertyAria, {
          title: listing.title,
        })}
      >
        <div className="beige-card__media">
          <BeigeCoverImage
            src={listing.photo_url}
            alt={listing.title}
            className="beige-img-zoom h-full w-full object-cover"
            placeholderClassName="flex h-full items-center justify-center text-sm text-[color:var(--beige-text-2)]"
            placeholder={dict.listing.noPhoto}
          />
          <span className="beige-card__badge">{offerLabel}</span>
        </div>
        <div className="beige-card__body">
          <p className="beige-card__price">
            {price.amount}
            <span className="beige-card__price-unit">
              {price.currency}
              {suffix}
            </span>
          </p>
          <h3 className="beige-card__title" title={listing.title}>
            <span className="line-clamp-2">{title}</span>
          </h3>
          {listing.location_label ? (
            <p className="beige-card__location">
              <BeigeIconMapPin className="beige-card__location-icon" />
              <span className="line-clamp-1">{listing.location_label}</span>
            </p>
          ) : null}
          {specLine ? <p className="beige-card__specs">{specLine}</p> : null}
          <p className="beige-card__type">{typeLabel}</p>
          <span className="beige-card__cta">
            {dict.listing.viewProperty}
            <BeigeIconArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </BeigeReveal>
  );
}
