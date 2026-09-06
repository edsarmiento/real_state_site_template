"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ListingPhoto } from "@/lib/listing-types";
import { fillTemplate, type SiteDictionary } from "@/lib/site-i18n";
import { BeigeCoverImage } from "@/themes/beige/beige-cover-image";
import {
  BeigeIconArrowLeft,
  BeigeIconArrowRight,
} from "@/themes/beige/beige-icons";

type Props = {
  title: string;
  photos: ListingPhoto[];
  fallbackUrl?: string | null;
  offerLabel?: string;
  dict: SiteDictionary;
};

export function BeigeGallery({
  title,
  photos,
  fallbackUrl,
  offerLabel,
  dict,
}: Props) {
  const urls = useMemo(() => {
    const fromPhotos = photos
      .map((photo) => photo.url?.trim())
      .filter((url): url is string => Boolean(url));
    if (fromPhotos.length > 0) return fromPhotos;
    const fallback = fallbackUrl?.trim();
    return fallback ? [fallback] : [];
  }, [photos, fallbackUrl]);

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const current = urls[index] ?? null;
  const labels = dict.listing.gallery;
  const thumbs = urls.slice(0, 5);

  const go = useCallback(
    (next: number) => {
      if (urls.length === 0) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setIndex((next + urls.length) % urls.length);
        return;
      }
      setVisible(false);
      window.setTimeout(() => {
        setIndex((next + urls.length) % urls.length);
        setVisible(true);
      }, 180);
    },
    [urls.length],
  );

  useEffect(() => {
    if (urls.length < 2) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") go(index - 1);
      if (event.key === "ArrowRight") go(index + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, urls.length]);

  if (urls.length === 0) {
    return (
      <div className="beige-gallery beige-gallery--empty">
        {labels.empty}
      </div>
    );
  }

  return (
    <div
      className="beige-gallery"
      role="region"
      aria-roledescription={labels.carouselRole}
      aria-label={fillTemplate(labels.photosOf, { title })}
    >
      <div className="beige-gallery__stage">
        <BeigeCoverImage
          src={current}
          alt={fillTemplate(labels.photoAlt, {
            title,
            index: index + 1,
            count: urls.length,
          })}
          className={`beige-gallery__main h-full w-full object-cover ${
            visible ? "opacity-100" : "opacity-40"
          }`}
          placeholderClassName="beige-gallery__placeholder"
          placeholder={dict.listing.noPhoto}
        />
        {offerLabel ? (
          <span className="beige-gallery__badge">{offerLabel}</span>
        ) : null}
        {urls.length > 1 ? (
          <>
            <button
              type="button"
              className="beige-gallery__nav beige-gallery__nav--prev"
              onClick={() => go(index - 1)}
              aria-label={labels.prev}
            >
              <BeigeIconArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="beige-gallery__nav beige-gallery__nav--next"
              onClick={() => go(index + 1)}
              aria-label={labels.next}
            >
              <BeigeIconArrowRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
      {thumbs.length > 1 ? (
        <div className="beige-gallery__thumbs" role="tablist" aria-label={labels.indicators}>
          {thumbs.map((url, i) => (
            <button
              key={url}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={fillTemplate(labels.goTo, { index: i + 1 })}
              className={i === index ? "beige-thumb is-active" : "beige-thumb"}
              onClick={() => go(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
