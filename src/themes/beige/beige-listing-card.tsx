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
  BeigeIconMapPin,
  BeigeIconMaximize,
  BeigeIconWhatsApp,
} from "@/themes/beige/beige-icons";
import { BeigeShareButton } from "@/themes/beige/beige-share-button";
import { formatBeigePriceParts } from "@/themes/beige/beige-ui";
import { luxuryVisibleSpecs } from "@/themes/luxury/luxury-specs";

type Props = {
  listing: PublicListingCard;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  whatsappHref?: string | null;
};

export function BeigeListingCard({
  listing,
  locale,
  defaultLocale,
  dict,
  whatsappHref,
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
  const bedrooms = specs.find((spec) => spec.key === "bedrooms");
  const bathrooms = specs.find((spec) => spec.key === "bathrooms");
  const area = specs.find((spec) => spec.key === "land" || spec.key === "built");

  return (
    <article className="beige-card-hover group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#E5D9C5]/80 bg-white shadow-sm">
      <div>
        <Link
          href={href}
          className="block"
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
        <div className="space-y-4 p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="beige-card__title text-xl font-medium leading-snug">
                {listing.title}
              </h3>
              {listing.location_label ? (
                <p className="mt-1 flex items-center gap-1 text-xs text-[#A39073]">
                  <BeigeIconMapPin className="h-3.5 w-3.5 text-[#A4B494]" />
                  {listing.location_label}
                </p>
              ) : null}
            </div>
            <p className="shrink-0 text-lg font-bold text-[#2D2A26]">
              {price.amount}
              <span className="ml-1 text-xs font-normal text-[#A39073]">
                {price.currency}
                {offerType === "rent" ? dict.listing.perMonth : ""}
              </span>
            </p>
          </div>
          {bedrooms || bathrooms || area ? (
            <div className="grid grid-cols-3 gap-2 border-y border-[#F4EFE6] py-3 text-center text-xs font-medium text-[#8A7759]">
              <span className="inline-flex items-center justify-center gap-1">
                <BeigeIconBed className="h-4 w-4" />
                {bedrooms?.value ?? "—"}
              </span>
              <span className="inline-flex items-center justify-center gap-1">
                <BeigeIconBath className="h-4 w-4" />
                {bathrooms?.value ?? "—"}
              </span>
              <span className="inline-flex items-center justify-center gap-1">
                <BeigeIconMaximize className="h-4 w-4" />
                {area?.value ?? "—"}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="space-y-3 p-8 pt-0">
        <div className="grid grid-cols-2 gap-2">
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
        {whatsappHref ? (
          <a
            href={whatsappHref}
            className="beige-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-[#A4B494] py-3 text-xs font-medium text-[#2D2A26] shadow-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BeigeIconWhatsApp className="h-4 w-4" />
            {dict.listing.consultWhatsApp}
          </a>
        ) : null}
      </div>
    </article>
  );
}
