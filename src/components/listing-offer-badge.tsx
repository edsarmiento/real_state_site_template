"use client";

import { OFFER_TYPE_LABEL, type ListingOfferType } from "@/lib/listing-types";
import { useSiteLayoutStyled } from "@/components/site-layout-variant-provider";

type Props = {
  offerType: ListingOfferType;
  className?: string;
  styledLayout?: boolean;
  saleLabel?: string;
  rentLabel?: string;
};

export function ListingOfferBadge({
  offerType,
  className = "",
  styledLayout,
  saleLabel,
  rentLabel,
}: Props) {
  const contextStyled = useSiteLayoutStyled();
  const styled = styledLayout ?? contextStyled;
  const sale = offerType === "sale";
  const tone = styled
    ? sale
      ? "bg-emerald-700"
      : "bg-blue-700"
    : sale
      ? "bg-zinc-800"
      : "bg-zinc-600";

  return (
    <span
      className={[
        "listing-offer-badge inline-flex rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white",
        tone,
        className,
      ].join(" ")}
    >
      {offerType === "sale"
        ? (saleLabel ?? OFFER_TYPE_LABEL.sale)
        : (rentLabel ?? OFFER_TYPE_LABEL.rent)}
    </span>
  );
}
