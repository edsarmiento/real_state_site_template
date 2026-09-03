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
  dict: SiteDictionary;
};

export function BeigeGallery({ title, photos, fallbackUrl, dict }: Props) {
  const urls = useMemo(() => {
    const fromPhotos = photos
      .map((photo) => photo.url?.trim())
      .filter((url): url is string => Boolean(url));
    if (fromPhotos.length > 0) return fromPhotos;
    const fallback = fallbackUrl?.trim();
    return fallback ? [fallback] : [];
  }, [photos, fallbackUrl]);

  const [index, setIndex] = useState(0);
  const current = urls[index] ?? null;
  const labels = dict.listing.gallery;

  const go = useCallback(
    (next: number) => {
      if (urls.length === 0) return;
      setIndex((next + urls.length) % urls.length);
    },
    [urls.length],
  );

  useEffect(() => {
    if (urls.length < 2) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") setIndex((i) => (i - 1 + urls.length) % urls.length);
      if (event.key === "ArrowRight") setIndex((i) => (i + 1) % urls.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [urls.length]);

  if (urls.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-[#F4EFE6] text-sm text-[#A39073]">
        {labels.empty}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-[#F4EFE6]"
      role="region"
      aria-roledescription={labels.carouselRole}
      aria-label={fillTemplate(labels.photosOf, { title })}
    >
      <BeigeCoverImage
        src={current}
        alt={fillTemplate(labels.photoAlt, {
          title,
          index: index + 1,
          count: urls.length,
        })}
        className="beige-gallery__main aspect-[16/10] w-full object-cover"
        placeholderClassName="flex aspect-[16/10] items-center justify-center text-sm text-[#A39073]"
        placeholder={dict.listing.noPhoto}
      />
      {urls.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#FBF9F5]/90 text-[#2D2A26]"
            onClick={() => go(index - 1)}
            aria-label={labels.prev}
          >
            <BeigeIconArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#FBF9F5]/90 text-[#2D2A26]"
            onClick={() => go(index + 1)}
            aria-label={labels.next}
          >
            <BeigeIconArrowRight className="h-5 w-5" />
          </button>
          <div
            className="absolute bottom-3 left-0 right-0 flex justify-center gap-2"
            role="tablist"
            aria-label={labels.indicators}
          >
            {urls.map((_, i) => (
              <button
                key={urls[i]}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={fillTemplate(labels.goTo, { index: i + 1 })}
                className={`h-2 w-2 rounded-full ${
                  i === index ? "bg-[#A4B494]" : "bg-[#FBF9F5]/70"
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
