"use client";

import { OFFER_TYPE_LABEL, type ListingOfferType } from "@/lib/listing-types";
import { useSiteLayoutStyled } from "@/components/site-layout-variant-provider";

type Props = {
  offerType: ListingOfferType;
  className?: string;
  styledLayout?: boolean;
};

export function ListingOfferBadge({
  offerType,
  className = "",
  styledLayout,
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
        "inline-flex rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white",
        tone,
        className,
      ].join(" ")}
    >
      {OFFER_TYPE_LABEL[offerType]}
    </span>
  );
}
