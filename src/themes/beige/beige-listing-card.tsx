import Link from "next/link";
import { parseOfferType, type PublicListingCard } from "@/lib/listing-types";
import {
  fillTemplate,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { BeigeCoverImage } from "@/themes/beige/beige-cover-image";
import {
  BeigeIconArrowRight,
  BeigeIconBath,
  BeigeIconBed,
  BeigeIconMaximize,
} from "@/themes/beige/beige-icons";
import { BeigeShareButton } from "@/themes/beige/beige-share-button";
import { formatBeigePriceParts } from "@/themes/beige/beige-ui";
import { luxuryVisibleSpecs } from "@/themes/luxury/luxury-specs";

type Props = {
  listing: PublicListingCard;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
};

export function BeigeListingCard({
  listing,
  locale,
  defaultLocale,
  dict,
}: Props) {
  const offerType = parseOfferType(listing.offer_type);
  const offerLabel =
    offerType === "sale" ? dict.listing.sale : dict.listing.rent;
  const href = localizedHref(
    `/inmueble/${listing.slug}`,
    locale,
    null,
    defaultLocale,
  );
  const price = formatBeigePriceParts(
    listing.rent_cents,
    listing.currency,
    locale,
  );
  const specs = luxuryVisibleSpecs(listing);
  const typeLabel =
    dict.propertyTypes[
      listing.property_type as keyof typeof dict.propertyTypes
    ] ?? listing.property_type;

  return (
    <article className="beige-card-hover group overflow-hidden rounded-2xl border border-[#E5D9C5] bg-[#FBF9F5]">
      <Link
        href={href}
        className="block"
        aria-label={fillTemplate(dict.listing.viewPropertyAria, {
          title: listing.title,
        })}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F4EFE6]">
          <BeigeCoverImage
            src={listing.photo_url}
            alt={listing.title}
            className="beige-img-zoom h-full w-full object-cover"
            placeholderClassName="flex h-full items-center justify-center text-sm text-[#A39073]"
            placeholder={dict.listing.noPhoto}
          />
          <span className="absolute left-3 top-3 rounded-full bg-[#2D2A26]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#FBF9F5]">
            {offerLabel}
          </span>
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <p className="text-lg font-semibold text-[#2D2A26]">
          {price.amount}{" "}
          <span className="text-sm font-normal text-[#A39073]">
            {price.currency}
            {offerType === "rent" ? ` ${dict.listing.perMonth}` : ""}
          </span>
        </p>
        <h3 className="beige-card__title text-xl leading-snug">{listing.title}</h3>
        {listing.location_label ? (
          <p className="text-sm text-[#8A7759]">{listing.location_label}</p>
        ) : null}
        <p className="text-xs uppercase tracking-wider text-[#A39073]">
          {typeLabel}
        </p>
        {specs.length > 0 ? (
          <ul className="flex flex-wrap gap-4 text-xs text-[#8A7759]">
            {specs.map((spec) => (
              <li key={spec.key} className="inline-flex items-center gap-1.5">
                {spec.key === "bedrooms" ? (
                  <BeigeIconBed className="h-3.5 w-3.5" />
                ) : spec.key === "bathrooms" ? (
                  <BeigeIconBath className="h-3.5 w-3.5" />
                ) : (
                  <BeigeIconMaximize className="h-3.5 w-3.5" />
                )}
                {spec.value}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#8F9F81]"
          >
            {dict.listing.viewDetail}
            <BeigeIconArrowRight className="h-4 w-4" />
          </Link>
          <BeigeShareButton
            slug={listing.slug}
            title={listing.title}
            dict={dict}
            className="text-xs uppercase tracking-wider text-[#A39073] underline-offset-4 hover:underline"
          />
        </div>
      </div>
    </article>
  );
}
