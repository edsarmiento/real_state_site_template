import type { ReactNode } from "react";
import type { SiteLocale } from "@/lib/site-i18n";
import { formatLuxuryPriceParts } from "@/themes/luxury/luxury-ui";

type Props = {
  cents: number;
  currency?: string | null;
  locale: SiteLocale;
  className?: string;
  suffix?: ReactNode;
};

export function LuxuryPrice({
  cents,
  currency,
  locale,
  className,
  suffix,
}: Props) {
  const parts = formatLuxuryPriceParts(cents, currency, locale);
  return (
    <span className={["luxury-price", className].filter(Boolean).join(" ")}>
      <span className="luxury-price__amount">{parts.amount}</span>
      <span className="luxury-price__currency">{parts.currency}</span>
      {suffix}
    </span>
  );
}
