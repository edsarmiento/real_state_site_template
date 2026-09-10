import Link from "next/link";
import type { PublicListingCard } from "@/lib/listing-types";
import { catalogSearchParams } from "@/lib/catalog-pagination";
import {
  locationsFromListings,
  pickLocalized,
  type PublicLocation,
} from "@/lib/public-site-content";
import {
  fillTemplate,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { UltraIconArrowRight } from "@/themes/ultra/ultra-icons";
import { representativeListingPhoto } from "@/themes/ultra/ultra-location-photo";
import { UltraReveal } from "@/themes/ultra/ultra-reveal";

function fallbackLocations(listings: PublicListingCard[]): PublicLocation[] {
  const fromCity = locationsFromListings(listings);
  if (fromCity.length > 0) return fromCity;
  const labeled = listings.find((item) => item.location_label?.trim());
  if (!labeled?.location_label?.trim()) return [];
  return [
    {
      id: "listing-location",
      name: labeled.location_label.trim(),
      filter: labeled.city?.trim() ? { city: labeled.city.trim() } : {},
    },
  ];
}

type LocationItem = {
  location: PublicLocation;
  href: string;
  imageSrc: string | null;
  fromListing: boolean;
};

type Props = {
  locations: PublicLocation[];
  listings: PublicListingCard[];
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
};

export function UltraLocations({
  locations,
  listings,
  locale,
  defaultLocale,
  dict,
}: Props) {
  const source =
    locations.length > 0 ? locations : fallbackLocations(listings);

  const items = source
    .map((location): LocationItem | null => {
      const city = location.filter.city?.trim();
      const href = city
        ? localizedHref(
            "/",
            locale,
            catalogSearchParams({
              oferta: "all",
              city,
              propertyType: "",
              bedrooms: "",
            }),
            defaultLocale,
          )
        : localizedHref("/#catalogo", locale, null, defaultLocale);
      const configured = location.imageUrl?.trim() || null;
      const listingPhoto = configured
        ? null
        : representativeListingPhoto(city || location.name, listings);
      return {
        location,
        href,
        imageSrc: configured || listingPhoto,
        fromListing: Boolean(!configured && listingPhoto),
      };
    })
    .filter((item): item is LocationItem => Boolean(item));

  if (items.length === 0) return null;

  const isSingle = items.length === 1;

  return (
    <section
      id="ubicaciones"
      className={
        isSingle ? "ultra-locations ultra-locations--single" : "ultra-locations"
      }
      aria-labelledby="ultra-locations-title"
    >
      <div
        className={
          isSingle ? "ultra-shell ultra-locations__split" : "ultra-shell"
        }
      >
        <UltraReveal variant="up" className="ultra-locations__copy">
          <div className={isSingle ? undefined : "ultra-section-head"}>
            <p className="ultra-eyebrow">{dict.locations.eyebrow}</p>
            <h2 id="ultra-locations-title" className="ultra-section-title">
              {dict.locations.title}
            </h2>
            <p className="ultra-lead">{dict.locations.description}</p>
          </div>
        </UltraReveal>
        <ul
          className={`ultra-locations__grid ${
            isSingle
              ? "ultra-locations__grid--single"
              : "ultra-locations__grid--multi"
          }`}
        >
          {items.map(({ location, href, imageSrc, fromListing }) => {
            const description = pickLocalized(
              location.shortDescription,
              locale,
            );
            const alt = imageSrc
              ? fromListing
                ? fillTemplate(dict.locations.representativeAlt, {
                    name: location.name,
                  })
                : pickLocalized(location.imageAlt, locale) ||
                  fillTemplate(dict.locations.fallbackAlt, {
                    name: location.name,
                  })
              : "";

            return (
              <li key={location.id} className="ultra-locations__item">
                <UltraReveal variant="zoom" delayMs={80}>
                  <Link href={href} className="ultra-location-card">
                    <div className="ultra-location-card__media">
                      {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageSrc} alt={alt} />
                      ) : (
                        <div
                          className="ultra-location-card__placeholder"
                          aria-hidden
                        />
                      )}
                      <span className="ultra-wine-overlay" aria-hidden />
                    </div>
                    <span className="ultra-location-card__body">
                      <span className="ultra-location-card__name">
                        {location.name}
                      </span>
                      {description ? (
                        <span className="ultra-location-card__excerpt">
                          {description}
                        </span>
                      ) : null}
                      <span className="ultra-location-card__cta">
                        {dict.locations.cta}
                        <UltraIconArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </span>
                  </Link>
                </UltraReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
