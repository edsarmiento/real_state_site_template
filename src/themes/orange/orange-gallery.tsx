"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { ListingPhoto } from "@/lib/listing-types";
import { fillTemplate, type SiteDictionary } from "@/lib/site-i18n";
import {
  OrangeIconArrowLeft,
  OrangeIconArrowRight,
} from "@/themes/orange/orange-icons";

type Props = {
  title: string;
  photos: ListingPhoto[];
  fallbackUrl?: string | null;
  dict: SiteDictionary;
};

export function OrangeGallery({ title, photos, fallbackUrl, dict }: Props) {
  const urls = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    const push = (raw?: string | null) => {
      const url = raw?.trim();
      if (!url || seen.has(url)) return;
      seen.add(url);
      list.push(url);
    };
    const ordered = [...photos].sort((a, b) => a.position - b.position);
    for (const photo of ordered) push(photo.url);
    push(fallbackUrl);
    return list;
  }, [photos, fallbackUrl]);

  const [index, setIndex] = useState(0);
  const current = urls[index] ?? null;
  const labels = dict.listing.gallery;
  const count = urls.length;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex((next + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count < 2) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") go(index - 1);
      if (event.key === "ArrowRight") go(index + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, go, index]);

  if (!current) {
    return <div className="orange-gallery__empty">{labels.empty}</div>;
  }

  return (
    <div
      className="orange-gallery"
      role="region"
      aria-roledescription={labels.carouselRole}
      aria-label={fillTemplate(labels.photosOf, { title })}
    >
      <div className="orange-gallery__stage">
        <Image
          src={current}
          alt={fillTemplate(labels.photoAlt, {
            title,
            index: index + 1,
            count,
          })}
          fill
          sizes="(max-width: 1023px) 100vw, 58vw"
          preload={index === 0}
          unoptimized
          className="orange-gallery__image"
        />
        {count > 1 ? (
          <>
            <button
              type="button"
              className="orange-gallery__nav orange-gallery__nav--prev"
              onClick={() => go(index - 1)}
              aria-label={labels.prev}
            >
              <OrangeIconArrowLeft />
            </button>
            <span className="orange-gallery__count">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              className="orange-gallery__nav orange-gallery__nav--next"
              onClick={() => go(index + 1)}
              aria-label={labels.next}
            >
              <OrangeIconArrowRight />
            </button>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <div className="orange-gallery__thumbs">
          {urls.slice(0, 10).map((url, i) => (
            <button
              key={url}
              type="button"
              className={
                i === index
                  ? "orange-gallery__thumb is-active"
                  : "orange-gallery__thumb"
              }
              onClick={() => setIndex(i)}
              aria-label={fillTemplate(labels.goTo, { index: i + 1 })}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="80px"
                unoptimized
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
