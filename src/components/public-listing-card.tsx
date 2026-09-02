import Link from "next/link";
import { ListingOfferBadge } from "@/components/listing-offer-badge";
import {
  formatRentCents,
  listingCardSpecLine,
  listingPriceSuffix,
  parseOfferType,
  type PublicListingCard,
} from "@/lib/listing-types";
import {
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import type { PropertyType } from "@/lib/property-types";

type Props = {
  listing: PublicListingCard;
  styledLayout?: boolean;
  dict?: SiteDictionary;
  locale?: SiteLocale;
  defaultLocale?: SiteLocale;
};

function propertyLabel(
  dict: SiteDictionary | undefined,
  type: string,
): string {
  if (dict && type in dict.propertyTypes) {
    return dict.propertyTypes[type as PropertyType];
  }
  return type;
}

export function PublicListingCard({
  listing,
  styledLayout = true,
  dict,
  locale,
  defaultLocale,
}: Props) {
  const offerType = parseOfferType(listing.offer_type);
  const suffix =
    offerType === "rent" ? (dict?.listing.perMonth ?? listingPriceSuffix(offerType)) : null;
  const typeLabel = propertyLabel(dict, listing.property_type);
  const specLine = listingCardSpecLine(listing);
  const href =
    locale && defaultLocale
      ? localizedHref(
          `/inmueble/${listing.slug}`,
          locale,
          null,
          defaultLocale,
        )
      : `/inmueble/${listing.slug}`;

  const cardRing = styledLayout
    ? "ring-blue-950/10 hover:ring-blue-600/25"
    : "ring-zinc-200 hover:ring-zinc-300";
  const priceClass = styledLayout ? "text-blue-700" : "text-zinc-950";
  const titleHover = styledLayout
    ? "group-hover:text-blue-800"
    : "group-hover:text-zinc-700";

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 transition hover:-translate-y-0.5 hover:shadow-lg ${cardRing}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {listing.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.photo_url}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            {dict?.listing.noPhoto ?? "Sin foto"}
          </div>
        )}
        <ListingOfferBadge
          offerType={offerType}
          styledLayout={styledLayout}
          className="absolute left-3 top-3"
          saleLabel={dict?.listing.sale}
          rentLabel={dict?.listing.rent}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className={`text-xl font-semibold tabular-nums ${priceClass}`}>
          {formatRentCents(listing.rent_cents, listing.currency)}
          {suffix ? (
            <span className="ml-1 text-sm font-medium text-zinc-500">{suffix}</span>
          ) : null}
        </p>
        <p className={`line-clamp-2 font-semibold leading-snug text-zinc-950 ${titleHover}`}>
          {listing.title}
        </p>
        <p className="line-clamp-1 text-sm text-zinc-600">{listing.location_label}</p>
        {specLine ? (
          <p className="text-sm font-medium text-zinc-700">{specLine}</p>
        ) : null}
        <p className="mt-auto pt-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
          {typeLabel}
        </p>
      </div>
    </Link>
  );
}
