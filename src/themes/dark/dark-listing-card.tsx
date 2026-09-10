import Link from "next/link";
import {
  listingPublicSpecsLocalized,
  publicListingCardModel,
  type PublicListingCard,
} from "@/lib/listing-types";
import { fillTemplate, type SiteDictionary, type SiteLocale } from "@/lib/site-i18n";
import { DarkCoverImage } from "@/themes/dark/dark-cover-image";
import { displayListingTitle } from "@/themes/dark/dark-copy";
import {
  DarkIconArrowUpRight,
  DarkIconBath,
  DarkIconBed,
  DarkIconHome,
  DarkIconMaximize,
} from "@/themes/dark/dark-icons";
import { DarkReveal } from "@/themes/dark/dark-reveal";
import { formatDarkPriceParts } from "@/themes/dark/dark-ui";

type Props = {
  listing: PublicListingCard;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  index?: number;
};

function specIcon(key: string) {
  if (key === "bedrooms") return DarkIconBed;
  if (key === "bathrooms") return DarkIconBath;
  if (key === "land" || key === "built") return DarkIconMaximize;
  return DarkIconHome;
}

export function DarkListingCard({
  listing,
  locale,
  defaultLocale,
  dict,
  index = 0,
}: Props) {
  const { href, suffix, offerType } = publicListingCardModel(listing, {
    dict,
    locale,
    defaultLocale,
  });
  const price = formatDarkPriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const title = displayListingTitle(listing.title) || listing.title;
  const specs = listingPublicSpecsLocalized(listing, dict).slice(0, 3);
  const offerLabel =
    offerType === "sale" ? dict.results.forSale : dict.results.forRent;

  return (
    <DarkReveal variant="up" delayMs={(index % 3) * 150}>
      <Link
        href={href}
        className="dark-card"
        aria-label={fillTemplate(dict.listing.viewPropertyAria, {
          title: listing.title,
        })}
      >
        <DarkCoverImage
          src={listing.photo_url}
          alt={listing.title}
          className="dark-card__photo"
          placeholderClassName="dark-card__placeholder"
          placeholder={dict.listing.noPhoto}
        />
        <span className="dark-card__badge">{offerLabel}</span>
        {specs.length > 0 ? (
          <ul className="dark-card__specs" aria-hidden>
            {specs.map((spec) => {
              const Icon = specIcon(spec.key);
              return (
                <li key={spec.key} className="dark-card__spec">
                  <Icon className="dark-card__spec-icon" />
                  <span>
                    {spec.key === "bedrooms" || spec.key === "bathrooms"
                      ? `${spec.value} ${spec.label.toLowerCase()}`
                      : spec.value}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
        <div className="dark-card__overlay" aria-hidden />
        <div className="dark-card__body">
          {listing.location_label ? (
            <p className="dark-card__location">{listing.location_label}</p>
          ) : null}
          <h3 className="dark-card__title">{title}</h3>
          <p className="dark-card__price">
            {price.amount}{" "}
            <span className="dark-card__price-unit">
              {price.currency}
              {suffix ? ` ${suffix}` : ""}
            </span>
          </p>
        </div>
        <span className="dark-card__cta" aria-hidden>
          <DarkIconArrowUpRight className="h-4 w-4" />
        </span>
      </Link>
    </DarkReveal>
  );
}
