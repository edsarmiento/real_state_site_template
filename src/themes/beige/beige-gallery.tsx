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
      <div className="flex h-[400px] items-center justify-center rounded-2xl bg-[#F4EFE6] text-sm text-[#A39073] sm:h-[500px]">
        {labels.empty}
      </div>
    );
  }

  return (
    <div
      className="space-y-4 rounded-3xl border border-[#E5D9C5] bg-white p-4 shadow-sm"
      role="region"
      aria-roledescription={labels.carouselRole}
      aria-label={fillTemplate(labels.photosOf, { title })}
    >
      <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-md sm:h-[500px]">
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
          placeholderClassName="flex h-full items-center justify-center text-sm text-[#A39073]"
          placeholder={dict.listing.noPhoto}
        />
        {offerLabel ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#2D2A26] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
            {offerLabel}
          </span>
        ) : null}
        {urls.length > 1 ? (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2D2A26] shadow-md transition hover:scale-105"
              onClick={() => go(index - 1)}
              aria-label={labels.prev}
            >
              <BeigeIconArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2D2A26] shadow-md transition hover:scale-105"
              onClick={() => go(index + 1)}
              aria-label={labels.next}
            >
              <BeigeIconArrowRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
      {thumbs.length > 1 ? (
        <div className="grid grid-cols-5 gap-3" role="tablist" aria-label={labels.indicators}>
          {thumbs.map((url, i) => (
            <button
              key={url}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={fillTemplate(labels.goTo, { index: i + 1 })}
              className={
                i === index
                  ? "beige-thumb is-active h-20 overflow-hidden rounded-xl"
                  : "beige-thumb h-20 overflow-hidden rounded-xl"
              }
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
