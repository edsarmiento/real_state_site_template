import Link from "next/link";
import { ListingOfferBadge } from "@/components/listing-offer-badge";
import {
  formatRentCents,
  publicListingCardModel,
  type PublicListingCard as PublicListingCardType,
} from "@/lib/listing-types";
import {
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";

type Props = {
  listing: PublicListingCardType;
  styledLayout?: boolean;
  dict?: SiteDictionary;
  locale?: SiteLocale;
  defaultLocale?: SiteLocale;
  className?: string;
  ctaLabel?: string;
};

export function PublicListingCard({
  listing,
  styledLayout = true,
  dict,
  locale,
  defaultLocale,
  className,
  ctaLabel,
}: Props) {
  const { offerType, href, suffix, typeLabel, specLine } = publicListingCardModel(
    listing,
    { dict, locale, defaultLocale },
  );

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
      className={[
        "public-listing-card group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white ring-1 transition hover:-translate-y-0.5 hover:shadow-lg",
        cardRing,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="public-listing-card__media relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {listing.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.photo_url}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
          />
        ) : (
          <div className="public-listing-card__placeholder flex h-full items-center justify-center text-sm text-zinc-400">
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
        {ctaLabel ? (
          <span className="public-listing-card__cta hidden" aria-hidden>
            {ctaLabel}
          </span>
        ) : null}
      </div>

      <div className="public-listing-card__body flex flex-1 flex-col gap-2 p-4">
        <p
          className={`public-listing-card__price text-xl font-semibold tabular-nums ${priceClass}`}
        >
          {formatRentCents(listing.rent_cents, listing.currency)}
          {suffix ? (
            <span className="ml-1 text-sm font-medium text-zinc-500">{suffix}</span>
          ) : null}
        </p>
        <p
          className={`public-listing-card__title line-clamp-2 font-semibold leading-snug text-zinc-950 ${titleHover}`}
        >
          {listing.title}
        </p>
        <p className="public-listing-card__location line-clamp-1 text-sm text-zinc-600">
          {listing.location_label}
        </p>
        {specLine ? (
          <p className="public-listing-card__specifications text-sm font-medium text-zinc-700">
            {specLine}
          </p>
        ) : null}
        <p
          className={[
            "public-listing-card__type pt-2 text-xs font-medium uppercase tracking-wide text-zinc-400",
            ctaLabel ? null : "mt-auto",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {typeLabel}
        </p>
        {ctaLabel ? (
          <span className="public-listing-card__cta mt-auto">{ctaLabel}</span>
        ) : null}
      </div>
    </Link>
  );
}
