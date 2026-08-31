import Link from "next/link";
import { parseOfferType, type PublicListingCard } from "@/lib/listing-types";
import {
  fillTemplate,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { LuxuryCoverImage } from "@/themes/luxury/luxury-cover-image";
import { LuxuryIconArrowRight } from "@/themes/luxury/luxury-icons";
import { LuxuryListingTitle } from "@/themes/luxury/luxury-listing-title";
import { LuxuryPrice } from "@/themes/luxury/luxury-price";
import { luxuryCardSpecLine } from "@/themes/luxury/luxury-specs";

type Props = {
  listing: PublicListingCard;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
};

export function LuxuryListingCard({
  listing,
  locale,
  defaultLocale,
  dict,
}: Props) {
  const offerType = parseOfferType(listing.offer_type);
  const suffix = offerType === "rent" ? dict.listing.perMonth : null;
  const typeLabel =
    dict.propertyTypes[
      listing.property_type as keyof typeof dict.propertyTypes
    ] ?? listing.property_type;
  const specLine = luxuryCardSpecLine(listing, dict.listing);
  const offerLabel = offerType === "sale" ? dict.listing.sale : dict.listing.rent;
  const href = localizedHref(
    `/inmueble/${listing.slug}`,
    locale,
    null,
    defaultLocale,
  );

  return (
    <Link
      href={href}
      className="luxury-card luxury-motion"
      aria-label={fillTemplate(dict.listing.viewPropertyAria, {
        title: listing.title,
      })}
    >
      <div className="luxury-card__media">
        <LuxuryCoverImage
          src={listing.photo_url}
          alt={listing.title}
          className="luxury-card__image"
          placeholderClassName="luxury-card__placeholder"
          placeholder={dict.listing.noPhoto}
        />
        <span className="luxury-card__badge">{offerLabel}</span>
      </div>

      <div className="luxury-card__body">
        <p className="luxury-card__price">
          <LuxuryPrice
            cents={listing.rent_cents}
            currency={listing.currency}
            locale={locale}
            suffix={
              suffix ? (
                <span className="luxury-card__suffix">{suffix}</span>
              ) : null
            }
          />
        </p>
        <LuxuryListingTitle
          title={listing.title}
          className="luxury-card__title"
        />
        {listing.location_label ? (
          <p className="luxury-card__location">{listing.location_label}</p>
        ) : null}
        {specLine ? <p className="luxury-card__specs">{specLine}</p> : null}
        <p className="luxury-card__type">{typeLabel}</p>
        <span className="luxury-card__cta">
          {dict.listing.viewProperty}
          <LuxuryIconArrowRight className="luxury-icon luxury-card__arrow" />
        </span>
      </div>
    </Link>
  );
}