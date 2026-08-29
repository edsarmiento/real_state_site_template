import { OFFER_TYPE_LABEL, type ListingOfferType } from "@/lib/listing-types";

type Props = {
  offerType: ListingOfferType;
  className?: string;
};

export function ListingOfferBadge({ offerType, className = "" }: Props) {
  const sale = offerType === "sale";
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white",
        sale ? "bg-emerald-700" : "bg-blue-700",
        className,
      ].join(" ")}
    >
      {OFFER_TYPE_LABEL[offerType]}
    </span>
  );
}
