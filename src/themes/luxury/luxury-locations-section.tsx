import Link from "next/link";
import type { PublicListingCard } from "@/lib/listing-types";
import {
  pickLocalized,
  type PublicLocation,
} from "@/lib/public-site-content";
import {
  fillTemplate,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { LuxuryIconArrowRight } from "@/themes/luxury/luxury-icons";
import { LuxuryLocationMedia } from "@/themes/luxury/luxury-location-media";
import { LuxuryReveal } from "@/themes/luxury/luxury-reveal";

type Props = {
  locations: PublicLocation[];
  listings?: PublicListingCard[];
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
};

function normalizeCity(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function cityKey(value: string): string {
  return normalizeCity(value).split(",")[0]?.trim() || "";
}

function representativeListingPhoto(
  city: string | undefined,
  listings: PublicListingCard[],
): string | null {
  if (!city) return null;
  const needle = cityKey(city);
  if (!needle) return null;
  const match = listings.find((listing) => {
    if (cityKey(listing.city || "") !== needle) return false;
    return Boolean(listing.photo_url?.trim());
  });
  return match?.photo_url?.trim() || null;
}

function locationHref(
  location: PublicLocation,
  locale: SiteLocale,
  defaultLocale: SiteLocale,
): string | null {
  const city = location.filter.city?.trim();
  if (!city) return null;
  return localizedHref("/", locale, { city }, defaultLocale);
}

export function LuxuryLocationsSection({
  locations,
  listings = [],
  locale,
  defaultLocale,
  dict,
}: Props) {
  const items = locations
    .map((location) => {
      const href = locationHref(location, locale, defaultLocale);
      if (!href) return null;
      const configured = location.imageUrl?.trim() || null;
      const listingPhoto = configured
        ? null
        : representativeListingPhoto(location.filter.city, listings);
      return {
        location,
        href,
        imageSrc: configured || listingPhoto,
        fromListing: Boolean(!configured && listingPhoto),
      };
    })
    .filter(
      (
        item,
      ): item is {
        location: PublicLocation;
        href: string;
        imageSrc: string | null;
        fromListing: boolean;
      } => Boolean(item),
    );

  if (items.length === 0) return null;

  return (
    <section
      className="luxury-section luxury-locations"
      aria-labelledby="luxury-locations-title"
    >
      <LuxuryReveal>
        <div className="luxury-section__inner">
          <p className="luxury-kicker">{dict.locations.eyebrow}</p>
          <h2 id="luxury-locations-title" className="luxury-section__title">
            {dict.locations.title}
          </h2>
          <p className="luxury-section__lead">{dict.locations.description}</p>

          <ul
            className={
              items.length === 1
                ? "luxury-locations__grid luxury-locations__grid--one"
                : "luxury-locations__grid"
            }
          >
            {items.map(({ location, href, imageSrc, fromListing }) => {
              const description = pickLocalized(
                location.shortDescription,
                locale,
              );
              const alt = fromListing
                ? fillTemplate(dict.locations.representativeAlt, {
                    name: location.name,
                  })
                : pickLocalized(location.imageAlt, locale) ||
                  fillTemplate(dict.locations.fallbackAlt, {
                    name: location.name,
                  });

              return (
                <li key={location.id} className="luxury-locations__item">
                  <Link href={href} className="luxury-locations__card">
                    <LuxuryLocationMedia
                      src={imageSrc}
                      alt={alt}
                      name={location.name}
                    />
                    <div className="luxury-locations__copy">
                      <h3 className="luxury-locations__name">{location.name}</h3>
                      {description ? (
                        <p className="luxury-locations__excerpt">{description}</p>
                      ) : null}
                      <span className="luxury-locations__cta">
                        {dict.locations.cta}
                        <LuxuryIconArrowRight className="luxury-icon luxury-locations__arrow" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </LuxuryReveal>
    </section>
  );
}