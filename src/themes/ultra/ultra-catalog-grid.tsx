"use client";

import { PublicListingCard } from "@/components/public-listing-card";
import type { PublicListingCard as PublicListingCardType } from "@/lib/listing-types";
import type { SiteDictionary, SiteLocale } from "@/lib/site-i18n";
import { UltraReveal } from "@/themes/ultra/ultra-reveal";

type Props = {
  listings: PublicListingCardType[];
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

const seenSlugs = new Set<string>();

export function UltraCatalogGrid({
  listings,
  dict,
  locale,
  defaultLocale,
}: Props) {
  return (
    <ul className="ultra-grid">
      {listings.map((listing, index) => {
        const firstSeen = !seenSlugs.has(listing.slug);
        seenSlugs.add(listing.slug);
        const card = (
          <div
            className="ultra-card"
            data-ultra-cta={dict.listing.viewDetail}
          >
            <PublicListingCard
              listing={listing}
              styledLayout
              dict={dict}
              locale={locale}
              defaultLocale={defaultLocale}
            />
          </div>
        );

        return (
          <li key={listing.slug} className="min-w-0">
            {firstSeen ? (
              <UltraReveal variant="up" delayMs={Math.min(index, 5) * 70}>
                {card}
              </UltraReveal>
            ) : (
              card
            )}
          </li>
        );
      })}
    </ul>
  );
}
