import Link from "next/link";
import { ListingOfferBadge } from "@/components/listing-offer-badge";
import {
  formatRentCents,
  listingCardSpecLine,
  listingPriceSuffix,
  parseOfferType,
  type PublicListingCard,
} from "@/lib/listing-types";
import { propertyTypeLabel } from "@/lib/property-labels";
import type { PropertyType } from "@/lib/property-types";

type Props = {
  listing: PublicListingCard;
};

export function PublicListingCard({ listing }: Props) {
  const offerType = parseOfferType(listing.offer_type);
  const suffix = listingPriceSuffix(offerType);
  const typeLabel =
    propertyTypeLabel[listing.property_type as PropertyType] ??
    listing.property_type;
  const specLine = listingCardSpecLine(listing);

  return (
    <Link
      href={`/inmueble/${listing.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-blue-950/10 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-blue-600/25"
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
            Sin foto
          </div>
        )}
        <ListingOfferBadge offerType={offerType} className="absolute left-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xl font-semibold tabular-nums text-blue-700">
          {formatRentCents(listing.rent_cents, listing.currency)}
          {suffix ? (
            <span className="ml-1 text-sm font-medium text-zinc-500">{suffix}</span>
          ) : null}
        </p>
        <p className="line-clamp-2 font-semibold leading-snug text-zinc-950 group-hover:text-blue-800">
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
