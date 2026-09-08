import Link from "next/link";
import type { PublicListingCard } from "@/lib/listing-types";
import { fillTemplate, type SiteDictionary } from "@/lib/site-i18n";
import { ultraHeroTitleParts } from "@/themes/ultra/ultra-hero-title";

type Props = {
  title: string;
  subtitle: string;
  eyebrow: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string | null;
  secondaryLabel: string;
  photoUrls: string[];
  listings: PublicListingCard[];
  dict: SiteDictionary;
  brandName: string;
  fallbackLabel: string;
};

function brandMonogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

export function UltraHero({
  title,
  subtitle,
  eyebrow,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  photoUrls,
  listings,
  dict,
  brandName,
  fallbackLabel,
}: Props) {
  const parts = ultraHeroTitleParts(title);
  const photos = photoUrls;
  const mainPhoto = photos[0] ?? null;
  const thumbs = photos.slice(1);
  const featured = listings.find((item) => {
    const url = item.photo_url?.trim();
    return Boolean(url && mainPhoto && url === mainPhoto);
  });
  const captionLocation = featured?.location_label?.trim() || "";
  const captionTitle = featured?.title?.trim() || "";
  const captionAlt = captionTitle
    ? fillTemplate(dict.listing.gallery.photoAlt, {
        title: captionTitle,
        index: 1,
        count: Math.max(photos.length, 1),
      })
    : fallbackLabel;
  const showCaption = Boolean((captionLocation || captionTitle) && mainPhoto);
  const monogram = brandMonogram(brandName);

  return (
    <section className="ultra-hero">
      <div className="ultra-shell ultra-hero__grid">
        <div className="ultra-hero__copy">
          {eyebrow ? (
            <p className="ultra-hero__badge">
              <span className="ultra-hero__pulse" aria-hidden />
              <span>{eyebrow}</span>
            </p>
          ) : null}
          <h1 className="ultra-hero__title">
            {parts.lead ? (
              <>
                {parts.lead}{" "}
                <em className="ultra-hero__accent">{parts.accent}</em>
              </>
            ) : (
              <em className="ultra-hero__accent">{parts.accent}</em>
            )}
          </h1>
          <p className="ultra-hero__subtitle">{subtitle}</p>
          <div className="ultra-hero__actions">
            <Link href={primaryHref} className="ultra-btn">
              <span>{primaryLabel}</span>
              <span aria-hidden>→</span>
            </Link>
            {secondaryHref ? (
              <Link href={secondaryHref} className="ultra-btn ultra-btn--ghost">
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>

        <div
          className={
            thumbs.length > 0
              ? "ultra-hero__gallery ultra-hero__gallery--has-thumbs"
              : "ultra-hero__gallery"
          }
        >
          <div className="ultra-hero-halo" aria-hidden />
          <div className="ultra-hero-stage">
            <div className="ultra-hero-frame">
              <div className="ultra-hero-media-motion">
                {mainPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mainPhoto}
                    alt={captionAlt}
                    className="ultra-hero-frame__img"
                  />
                ) : (
                  <div className="ultra-hero-fallback">
                    <div className="ultra-hero-fallback__art" aria-hidden="true" />
                    {monogram ? (
                      <p className="ultra-hero-fallback__mark" aria-hidden="true">
                        {monogram}
                      </p>
                    ) : null}
                    <p className="ultra-hero-fallback__label">{fallbackLabel}</p>
                  </div>
                )}
              </div>
              {showCaption ? (
                <div className="ultra-hero-scrim" aria-hidden="true" />
              ) : null}
              {showCaption ? (
                <div className="ultra-hero-caption">
                  {captionLocation ? (
                    <span className="ultra-hero-caption__kicker">
                      {captionLocation}
                    </span>
                  ) : null}
                  {captionTitle ? (
                    <p className="ultra-hero-caption__title">{captionTitle}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          {thumbs.length > 0 ? (
            <ul className="ultra-hero-thumbs">
              {thumbs.map((url, index) => (
                <li key={`${url}-${index}`} className="ultra-hero-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="ultra-hero-thumb__img" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
