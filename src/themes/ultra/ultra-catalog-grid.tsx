"use client";

import type { CSSProperties } from "react";
import { PublicListingCard } from "@/components/public-listing-card";
import type { PublicListingCard as PublicListingCardType } from "@/lib/listing-types";
import type { SiteDictionary, SiteLocale } from "@/lib/site-i18n";

type Props = {
  listings: PublicListingCardType[];
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function UltraCatalogGrid({
  listings,
  dict,
  locale,
  defaultLocale,
}: Props) {
  return (
    <ul className="ultra-grid">
      {listings.map((listing, index) => {
        const delayMs = Math.min(index, 5) * 70;
        const style =
          delayMs > 0
            ? ({ "--ultra-delay": `${delayMs}ms` } as CSSProperties)
            : undefined;

        return (
          <li key={listing.slug} className="min-w-0">
            <div
              className="ultra-card"
              data-ultra-cta={dict.listing.viewDetail}
              data-ultra-reveal="up"
              style={style}
            >
              <PublicListingCard
                listing={listing}
                styledLayout
                dict={dict}
                locale={locale}
                defaultLocale={defaultLocale}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
