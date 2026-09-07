import Link from "next/link";
import type { PublicListingCard } from "@/lib/listing-types";
import { fillTemplate, type SiteDictionary } from "@/lib/site-i18n";
import {
  ultraHeroTitleParts,
  uniquePhotoUrls,
} from "@/themes/ultra/ultra-hero-title";
import { UltraReveal } from "@/themes/ultra/ultra-reveal";

type Props = {
  title: string;
  subtitle: string;
  eyebrow: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string | null;
  secondaryLabel: string;
  photoUrls?: string[];
  listings: PublicListingCard[];
  dict: SiteDictionary;
};

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
}: Props) {
  const parts = ultraHeroTitleParts(title);
  const photos = uniquePhotoUrls(photoUrls, 3);
  const featured = listings.find((item) => item.photo_url) ?? listings[0];
  const captionLocation = featured?.location_label?.trim() || "";
  const captionTitle = featured?.title?.trim() || "";
  const mainPhoto = photos[0] ?? featured?.photo_url?.trim() ?? null;
  const thumbs = photos.slice(1);
  const captionAlt = captionTitle
    ? fillTemplate(dict.listing.gallery.photoAlt, {
        title: captionTitle,
        index: 1,
        count: Math.max(photos.length, 1),
      })
    : dict.listing.noPhoto;
  const showCaption = Boolean((captionLocation || captionTitle) && mainPhoto);

  return (
    <section className="ultra-hero">
      <div className="ultra-shell ultra-hero__grid">
        <div className="ultra-hero__copy">
          {eyebrow ? (
            <UltraReveal variant="up" durationMs={800}>
              <p className="ultra-hero__badge">
                <span className="ultra-hero__pulse" aria-hidden />
                <span>{eyebrow}</span>
              </p>
            </UltraReveal>
          ) : null}
          <UltraReveal variant="up" delayMs={80} durationMs={850}>
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
          </UltraReveal>
          <UltraReveal variant="up" delayMs={140} durationMs={850}>
            <p className="ultra-hero__subtitle">{subtitle}</p>
          </UltraReveal>
          <UltraReveal variant="up" delayMs={200} durationMs={850}>
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
          </UltraReveal>
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
                  <div className="ultra-hero-frame__placeholder" aria-hidden />
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
