import Link from "next/link";
import {
  listingPublicSpecsLocalized,
  publicListingCardModel,
  type PublicListingCard,
} from "@/lib/listing-types";
import { fillTemplate, type SiteDictionary, type SiteLocale } from "@/lib/site-i18n";
import { ExecutiveCoverImage } from "@/themes/executive/executive-cover-image";
import {
  ExecutiveIconArrowRight,
  ExecutiveIconBath,
  ExecutiveIconBed,
  ExecutiveIconHome,
  ExecutiveIconMapPin,
  ExecutiveIconRuler,
} from "@/themes/executive/executive-icons";
import { formatExecutivePriceParts } from "@/themes/executive/executive-brand";

type Props = {
  listing: PublicListingCard;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
};

function SpecIcon({ specKey }: { specKey: string }) {
  if (specKey === "bedrooms") return <ExecutiveIconBed className="h-3.5 w-3.5" />;
  if (specKey === "bathrooms") return <ExecutiveIconBath className="h-3.5 w-3.5" />;
  if (specKey === "land" || specKey === "built") {
    return specKey === "built" ? (
      <ExecutiveIconHome className="h-3.5 w-3.5" />
    ) : (
      <ExecutiveIconRuler className="h-3.5 w-3.5" />
    );
  }
  return <ExecutiveIconHome className="h-3.5 w-3.5" />;
}

export function ExecutiveListingCard({
  listing,
  locale,
  defaultLocale,
  dict,
}: Props) {
  const { href, suffix, offerLabel } = publicListingCardModel(listing, {
    dict,
    locale,
    defaultLocale,
  });
  const price = formatExecutivePriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const specs = listingPublicSpecsLocalized(listing, dict).slice(0, 3);

  return (
    <Link
      href={href}
      className="executive-card"
      aria-label={fillTemplate(dict.listing.viewPropertyAria, {
        title: listing.title,
      })}
    >
      <div className="executive-card__media">
        <ExecutiveCoverImage
          src={listing.photo_url}
          alt=""
          className="executive-card__photo"
          placeholderClassName="executive-card__placeholder"
          placeholder={dict.listing.noPhoto}
        />
        <span className="executive-card__badge">{offerLabel}</span>
      </div>
      <div className="executive-card__body">
        <div className="executive-card__price-row">
          <p className="executive-card__price">
            {price.amount}{" "}
            <span className="executive-card__currency">
              {price.currency}
              {suffix ? ` ${suffix}` : ""}
            </span>
          </p>
          <span className="executive-card__offer">{offerLabel}</span>
        </div>
        <h3 className="executive-card__title" title={listing.title}>
          <span className="line-clamp-2">{listing.title}</span>
        </h3>
        {listing.location_label ? (
          <p className="executive-card__location">
            <ExecutiveIconMapPin className="executive-card__pin" />
            <span className="line-clamp-1">{listing.location_label}</span>
          </p>
        ) : null}
        {specs.length > 0 ? (
          <ul className="executive-card__specs">
            {specs.map((spec) => (
              <li key={spec.key}>
                <SpecIcon specKey={spec.key} />
                <span>
                  {spec.key === "bedrooms"
                    ? fillTemplate(dict.listing.specBedroomsShort, {
                        count: spec.value,
                      })
                    : spec.key === "bathrooms"
                      ? `${spec.value} ${dict.listing.specs.bathrooms.toLowerCase()}`
                      : spec.value}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        <span className="executive-card__cta" aria-hidden="true">
          {dict.listing.viewProperty}
          <ExecutiveIconArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
