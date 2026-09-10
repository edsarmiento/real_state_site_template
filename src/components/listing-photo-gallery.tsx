"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ListingPhotoGalleryStrip } from "@/components/listing-photo-gallery-strip";
import {
  DEFAULT_LISTING_GALLERY_LABELS,
  type ListingGalleryLabels,
} from "@/lib/listing-gallery-labels";
import {
  listingGalleryStripChrome,
  type ListingGalleryStripChrome,
} from "@/lib/listing-gallery-strip";
import { listingGalleryPhotoUrls } from "@/lib/listing-gallery-urls";
import { galleryIndexAfterKey, wrapGalleryIndex } from "@/lib/listing-gallery-nav";
import type { ListingPhoto } from "@/lib/listing-types";
import { fillTemplate, type SiteLocale } from "@/lib/site-i18n";

export type { ListingGalleryLabels } from "@/lib/listing-gallery-labels";

export type ListingGalleryVariant = "carousel" | "strip";

type Props = {
  title: string;
  photos: ListingPhoto[];
  fallbackUrl?: string | null;
  className?: string;
  labels?: ListingGalleryLabels;
  styledLayout?: boolean;
  /** Default `carousel` preserves existing theme behavior. */
  variant?: ListingGalleryVariant;
  /** Required chrome copy when `variant="strip"` (defaults from locale). */
  stripChrome?: ListingGalleryStripChrome;
  locale?: SiteLocale;
  /** Theme attribute on the strip lightbox portal for scoped CSS. */
  portalSiteTheme?: string;
};

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ListingPhotoGalleryCarousel({
  title,
  urls,
  labels,
  className,
  styledLayout,
}: {
  title: string;
  urls: string[];
  labels: ListingGalleryLabels;
  className?: string;
  styledLayout: boolean;
}) {
  const count = urls.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(wrapGalleryIndex(index, count));
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    if (count <= 1) return;
    function onKey(e: KeyboardEvent) {
      const next = galleryIndexAfterKey(e.key, activeIndex, count);
      if (next == null) return;
      e.preventDefault();
      setActiveIndex(next);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, count]);

  const activeUrl = urls[activeIndex] ?? null;
  const rootClass = ["listing-gallery", className].filter(Boolean).join(" ");

  const stageRing = styledLayout ? "ring-blue-950/10" : "ring-zinc-200";
  const stageShadow = styledLayout
    ? "shadow-[0_24px_60px_-36px_rgba(37,99,235,0.55)]"
    : "shadow-sm";
  const thumbActive = styledLayout
    ? "ring-2 ring-blue-600 ring-offset-2"
    : "ring-2 ring-zinc-900 ring-offset-2";
  const thumbIdle = styledLayout
    ? "ring-1 ring-blue-950/10 hover:ring-blue-600/40"
    : "ring-1 ring-zinc-200 hover:ring-zinc-400";

  if (!activeUrl) {
    return (
      <div className={rootClass}>
        <div
          className={`listing-gallery__stage -mx-4 overflow-hidden bg-zinc-200 ring-1 sm:mx-0 sm:rounded-3xl ${stageRing}`}
        >
          <div className="flex aspect-[4/3] items-center justify-center text-base text-zinc-500 sm:aspect-[16/9] sm:text-sm">
            {labels.empty}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <div
        className={`listing-gallery__stage relative -mx-4 overflow-hidden bg-zinc-200 ring-1 sm:mx-0 sm:rounded-3xl ${stageRing} ${stageShadow}`}
        role="region"
        aria-roledescription={labels.carouselRole}
        aria-label={fillTemplate(labels.photosOf, { title })}
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current == null || count <= 1) return;
          const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
          const delta = endX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) < 40) return;
          if (delta > 0) goPrev();
          else goNext();
        }}
      >
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
          <div
            className="flex h-full w-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {urls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="h-full min-w-full w-full shrink-0 basis-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={fillTemplate(labels.photoAlt, {
                    title,
                    index: index + 1,
                    count,
                  })}
                  className="h-full w-full object-cover"
                  draggable={false}
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                    event.currentTarget.removeAttribute("src");
                  }}
                />
              </div>
            ))}
          </div>

          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label={labels.prev}
                className="listing-gallery__nav absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md ring-1 ring-black/5 transition hover:bg-white sm:h-10 sm:w-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={labels.next}
                className="listing-gallery__nav absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md ring-1 ring-black/5 transition hover:bg-white sm:h-10 sm:w-10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="listing-gallery__counter absolute right-3 bottom-3 rounded-full bg-black/55 px-3 py-1.5 text-sm font-medium text-white tabular-nums sm:text-xs">
                {activeIndex + 1} / {count}
              </div>

              <div
                className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5"
                role="tablist"
                aria-label={labels.indicators}
              >
                {urls.map((_, index) => {
                  const selected = index === activeIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-label={fillTemplate(labels.goTo, {
                        index: index + 1,
                      })}
                      onClick={() => goTo(index)}
                      className={[
                        "h-2.5 rounded-full transition sm:h-2",
                        selected
                          ? "w-7 bg-white sm:w-6"
                          : "w-2.5 bg-white/55 hover:bg-white/80 sm:w-2",
                      ].join(" ")}
                    />
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {count > 1 ? (
        <ul className="listing-gallery__thumbs mt-3 flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, index) => {
            const selected = index === activeIndex;
            return (
              <li key={`${url}-${index}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={fillTemplate(labels.view, {
                    index: index + 1,
                  })}
                  aria-current={selected ? "true" : undefined}
                  className={[
                    "h-24 w-32 overflow-hidden rounded-xl bg-zinc-200 transition sm:h-20 sm:w-28",
                    selected
                      ? `listing-gallery__thumb listing-gallery__thumb--active ${thumbActive}`
                      : `listing-gallery__thumb ${thumbIdle}`,
                  ].join(" ")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                      event.currentTarget.removeAttribute("src");
                    }}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function ListingPhotoGallery({
  title,
  photos,
  fallbackUrl,
  className,
  labels = DEFAULT_LISTING_GALLERY_LABELS,
  styledLayout = true,
  variant = "carousel",
  stripChrome,
  locale = "es",
  portalSiteTheme,
}: Props) {
  const urls = listingGalleryPhotoUrls(photos, fallbackUrl);

  if (variant === "strip") {
    return (
      <ListingPhotoGalleryStrip
        title={title}
        urls={urls}
        labels={labels}
        chrome={stripChrome ?? listingGalleryStripChrome(locale)}
        className={className}
        portalSiteTheme={portalSiteTheme}
      />
    );
  }

  return (
    <ListingPhotoGalleryCarousel
      title={title}
      urls={urls}
      labels={labels}
      className={className}
      styledLayout={styledLayout}
    />
  );
}
