import Link from "next/link";
import { parseOfferType, type PublicListingCard } from "@/lib/listing-types";
import {
  fillTemplate,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { BeigeCoverImage } from "@/themes/beige/beige-cover-image";
import { displayListingTitle } from "@/themes/beige/beige-display";
import {
  BeigeIconArrowRight,
  BeigeIconBath,
  BeigeIconBed,
  BeigeIconMapPin,
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
  const title = displayListingTitle(listing.title) || listing.title;
  const specItems = specs.map((spec) => {
    if (spec.key === "bedrooms") {
      return {
        key: spec.key,
        icon: BeigeIconBed,
        label: fillTemplate(dict.listing.specBedroomsShort, {
          count: spec.value,
        }),
      };
    }
    if (spec.key === "bathrooms") {
      return {
        key: spec.key,
        icon: BeigeIconBath,
        label: spec.value,
      };
    }
    return {
      key: spec.key,
      icon: BeigeIconMaximize,
      label: spec.value,
    };
  });

  return (
    <article className="beige-card-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-[#E5D9C5]/80 bg-white shadow-sm">
      <Link
        href={href}
        className="block shrink-0"
        aria-label={fillTemplate(dict.listing.viewPropertyAria, {
          title: listing.title,
        })}
      >
        <div className="relative h-72 overflow-hidden bg-[#F4EFE6]">
          <BeigeCoverImage
            src={listing.photo_url}
            alt={listing.title}
            className="beige-img-zoom h-full w-full object-cover"
            placeholderClassName="flex h-full items-center justify-center text-sm text-[#A39073]"
            placeholder={dict.listing.noPhoto}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"
            aria-hidden
          />
          <span className="absolute left-4 top-4 rounded-full bg-[#2D2A26]/90 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm">
            {listing.location_label || offerLabel}
          </span>
        </div>
      </Link>
      <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h3
            className="beige-card__title min-h-[3.25rem] text-xl font-medium leading-snug [overflow-wrap:anywhere]"
            title={listing.title}
          >
            <span className="line-clamp-3">{title}</span>
          </h3>
          <p className="shrink-0 text-lg font-bold leading-tight text-[#2D2A26] sm:pt-0.5 sm:text-right">
            {price.amount}
            <span className="ml-1 text-xs font-normal text-[#5c5346]">
              {price.currency}
              {offerType === "rent" ? dict.listing.perMonth : ""}
            </span>
          </p>
        </div>
        {listing.location_label ? (
          <p className="mt-2 flex items-start gap-1 text-xs text-[#8A7759]">
            <BeigeIconMapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8F9F81]" />
            <span className="line-clamp-2">{listing.location_label}</span>
          </p>
        ) : null}
        {specItems.length > 0 ? (
          <div
            className={`mt-4 grid gap-2 rounded-2xl border border-[#E5D9C5] bg-[#F4EFE6] px-2 py-3 text-center ${
              specItems.length === 1
                ? "grid-cols-1"
                : specItems.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
            }`}
          >
            {specItems.map((item) => (
              <span
                key={item.key}
                className="inline-flex flex-col items-center gap-0.5 px-1 text-[#2D2A26]"
              >
                <item.icon className="h-4 w-4 text-[#5c5346]" aria-hidden />
                <span className="text-sm font-semibold leading-snug">
                  {item.label}
                </span>
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
            <Link
              href={href}
              className="beige-soft-btn block rounded-2xl bg-[#FBF9F5] py-3 text-center text-xs font-medium text-[#2D2A26] shadow-sm"
            >
              {dict.listing.viewDetail}
              <BeigeIconArrowRight className="ml-1 inline h-3 w-3" />
            </Link>
            <BeigeShareButton
              slug={listing.slug}
              title={listing.title}
              dict={dict}
              className="beige-soft-btn w-full rounded-2xl bg-[#FBF9F5] py-3 text-xs font-medium text-[#2D2A26] shadow-sm"
            />
          </div>
      </div>
    </article>
  );
}
