import Link from "next/link";
import type { PublicListingCard } from "@/lib/listing-types";
import {
  catalogSearchParams,
} from "@/lib/catalog-pagination";
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
import { UltraIconArrowRight } from "@/themes/ultra/ultra-icons";

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
  const items = locations
    .map((location) => {
      const city = location.filter.city?.trim();
      if (!city) return null;
      const href = localizedHref(
        "/",
        locale,
        catalogSearchParams({
          oferta: "all",
          city,
          propertyType: "",
          bedrooms: "",
        }),
        defaultLocale,
      );
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
        <div
          className={
            isSingle ? "ultra-locations__copy" : "ultra-section-head"
          }
        >
          <p className="ultra-eyebrow">{dict.locations.eyebrow}</p>
          <h2 id="ultra-locations-title" className="ultra-section-title">
            {dict.locations.title}
          </h2>
          <p className="ultra-lead">{dict.locations.description}</p>
        </div>
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
            const alt = fromListing
              ? fillTemplate(dict.locations.representativeAlt, {
                  name: location.name,
                })
              : pickLocalized(location.imageAlt, locale) ||
                fillTemplate(dict.locations.fallbackAlt, {
                  name: location.name,
                });

            return (
              <li key={location.id}>
                <Link href={href} className="ultra-location-card">
                  <div className="ultra-location-card__media">
                    {imageSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageSrc} alt={alt} />
                    ) : (
                      <div className="ultra-location-card__placeholder" />
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
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
