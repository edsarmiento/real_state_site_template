"use client";

import type { SiteThemeName } from "@/themes/theme-definitions";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { dialogKeyboardAction } from "@/lib/dialog-keyboard";
import {
  LISTING_GALLERY_STRIP_FALLBACK_RATIO,
  clampGalleryIndex,
  galleryIndexAfterKeyClamped,
  listingGalleryCanGoNext,
  listingGalleryCanGoPrev,
  type ListingGalleryStripChrome,
} from "@/lib/listing-gallery-strip";
import type { ListingGalleryLabels } from "@/lib/listing-gallery-labels";
import { fillTemplate } from "@/lib/site-i18n";

type Props = {
  title: string;
  urls: string[];
  labels: ListingGalleryLabels;
  chrome: ListingGalleryStripChrome;
  className?: string;
  /** Set on the lightbox portal root for theme-scoped CSS (e.g. "dark"). */
  portalSiteTheme?: SiteThemeName;
};

function Chevron({
  direction,
  className,
}: {
  direction: "left" | "right";
  className?: string;
}) {
  if (direction === "left") {
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

function CloseIcon({ className }: { className?: string }) {
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
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function ListingPhotoGalleryStrip({
  title,
  urls,
  labels,
  chrome,
  className,
  portalSiteTheme,
}: Props) {
  const count = urls.length;
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const stripRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const viewAllRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const activeIndexRef = useRef(activeIndex);
  const ignoreScrollSyncRef = useRef(false);
  const scrollSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const titleId = useId();

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      if (scrollSyncTimerRef.current) clearTimeout(scrollSyncTimerRef.current);
    };
  }, []);

  const setRatio = useCallback((index: number, ratio: number) => {
    if (!Number.isFinite(ratio) || ratio <= 0) return;
    setRatios((prev) => {
      if (prev[index] != null && Math.abs(prev[index]! - ratio) < 0.001) {
        return prev;
      }
      return { ...prev, [index]: ratio };
    });
  }, []);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const node = slideRefs.current[index];
      const strip = stripRef.current;
      if (!node || !strip) return;
      const targetLeft = Math.max(
        0,
        Math.min(node.offsetLeft, strip.scrollWidth - strip.clientWidth),
      );
      ignoreScrollSyncRef.current = true;
      if (scrollSyncTimerRef.current) clearTimeout(scrollSyncTimerRef.current);
      strip.scrollTo({ left: targetLeft, behavior });

      let attempts = 0;
      const settle = () => {
        if (Math.abs(strip.scrollLeft - targetLeft) > 2 && attempts++ < 25) {
          scrollSyncTimerRef.current = setTimeout(settle, 40);
          return;
        }
        ignoreScrollSyncRef.current = false;
        scrollSyncTimerRef.current = null;
        if (Math.abs(strip.scrollLeft - targetLeft) <= 2) setActiveIndex(index);
        else strip.dispatchEvent(new Event("scroll"));
      };
      scrollSyncTimerRef.current = setTimeout(settle, behavior === "auto" ? 16 : 120);
    },
    [],
  );

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      if (count === 0) return;
      const next = clampGalleryIndex(index, count);
      setActiveIndex(next);
      scrollToIndex(next, behavior);
      thumbRefs.current[next]?.scrollIntoView({
        behavior,
        block: "nearest",
        inline: "nearest",
      });
    },
    [count, scrollToIndex],
  );

  const goPrev = useCallback(() => {
    if (!listingGalleryCanGoPrev(activeIndex)) return;
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    if (!listingGalleryCanGoNext(activeIndex, count)) return;
    goTo(activeIndex + 1);
  }, [activeIndex, count, goTo]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    queueMicrotask(() => {
      scrollToIndex(activeIndexRef.current, "auto");
      viewAllRef.current?.focus();
    });
  }, [scrollToIndex]);

  useLayoutEffect(() => {
    if (!lightboxOpen) return;
    closeRef.current?.focus();
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(event: KeyboardEvent) {
      const focusables = lightboxRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([tabindex="-1"]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const list = focusables ? [...focusables] : [];
      const focusIndex = list.indexOf(document.activeElement as HTMLElement);
      const action = dialogKeyboardAction({
        key: event.key,
        shiftKey: event.shiftKey,
        activeIndex: focusIndex,
        count: list.length,
      });
      if (action?.type === "close") {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (action?.type === "focus") {
        event.preventDefault();
        list[action.index]?.focus();
        return;
      }
      const next = galleryIndexAfterKeyClamped(event.key, activeIndexRef.current, count);
      if (next == null) return;
      event.preventDefault();
      setActiveIndex(next);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeLightbox, count, lightboxOpen]);

  useEffect(() => {
    if (lightboxOpen) return;
    const strip = stripRef.current;
    if (!strip) return;

    function syncActiveFromScroll() {
      if (ignoreScrollSyncRef.current) return;
      const root = stripRef.current;
      if (!root) return;
      const scrollLeft = root.scrollLeft;
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      slideRefs.current.forEach((node, index) => {
        if (!node) return;
        const dist = Math.abs(node.offsetLeft - scrollLeft);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      setActiveIndex((prev) => (prev === best ? prev : best));
    }

    strip.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    return () => strip.removeEventListener("scroll", syncActiveFromScroll);
  }, [lightboxOpen, count]);

  const activeRatio = ratios[activeIndex];
  const previousLayoutRef = useRef<{ index: number; ratio: number | undefined } | null>(null);
  useLayoutEffect(() => {
    const previous = previousLayoutRef.current;
    previousLayoutRef.current = { index: activeIndex, ratio: activeRatio };
    // A new active index can come from manual scrolling: do not snap it back.
    if (previous?.index === activeIndex && previous.ratio !== activeRatio) {
      scrollToIndex(activeIndex, "auto");
    }
  }, [activeIndex, activeRatio, scrollToIndex]);

  const rootClass = ["listing-gallery", "listing-gallery--strip", className]
    .filter(Boolean)
    .join(" ");

  if (count === 0) {
    return (
      <div className={rootClass}>
        <div className="listing-gallery__stage listing-gallery__stage--empty">
          <p>{labels.empty}</p>
        </div>
      </div>
    );
  }

  const canPrev = listingGalleryCanGoPrev(activeIndex);
  const canNext = listingGalleryCanGoNext(activeIndex, count);
  const showChrome = count > 1;

  const lightbox =
    lightboxOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={lightboxRef}
            {...(portalSiteTheme
              ? { "data-site-theme": portalSiteTheme }
              : {})}
            className="listing-gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              type="button"
              className="listing-gallery-lightbox__scrim"
              aria-label={chrome.close}
              tabIndex={-1}
              onClick={closeLightbox}
            />
            <div className="listing-gallery-lightbox__panel">
              <div className="listing-gallery-lightbox__toolbar">
                <p id={titleId} className="listing-gallery-lightbox__title">
                  {chrome.lightbox}
                </p>
                <p
                  className="listing-gallery-lightbox__counter"
                  aria-live="polite"
                >
                  {activeIndex + 1} / {count}
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  className="listing-gallery-lightbox__close"
                  aria-label={chrome.close}
                  onClick={closeLightbox}
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="listing-gallery-lightbox__stage">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urls[activeIndex]}
                  alt={fillTemplate(labels.photoAlt, {
                    title,
                    index: activeIndex + 1,
                    count,
                  })}
                  className="listing-gallery-lightbox__image"
                />
              </div>
              {showChrome ? (
                <div className="listing-gallery-lightbox__nav">
                  <button
                    type="button"
                    className="listing-gallery__nav"
                    aria-label={labels.prev}
                    disabled={!canPrev}
                    onClick={() =>
                      setActiveIndex((i) => clampGalleryIndex(i - 1, count))
                    }
                  >
                    <Chevron direction="left" className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="listing-gallery__nav"
                    aria-label={labels.next}
                    disabled={!canNext}
                    onClick={() =>
                      setActiveIndex((i) => clampGalleryIndex(i + 1, count))
                    }
                  >
                    <Chevron direction="right" className="h-5 w-5" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={rootClass}>
      <div
        className="listing-gallery__stage"
        role="region"
        aria-roledescription={labels.carouselRole}
        aria-label={fillTemplate(labels.photosOf, { title })}
        tabIndex={0}
        onKeyDown={(event) => {
          if (lightboxOpen) return;
          const next = galleryIndexAfterKeyClamped(
            event.key,
            activeIndex,
            count,
          );
          if (next == null) return;
          event.preventDefault();
          goTo(next);
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current == null || count <= 1) return;
          const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
          const delta = endX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) < 40) return;
          if (delta > 0) goPrev();
          else goNext();
        }}
      >
        <div ref={stripRef} className="listing-gallery__strip">
          {urls.map((url, index) => {
            const ratio = ratios[index] ?? LISTING_GALLERY_STRIP_FALLBACK_RATIO;
            return (
              <figure
                key={`${url}-${index}`}
                ref={(node) => {
                  slideRefs.current[index] = node;
                }}
                className="listing-gallery__slide"
                style={{ aspectRatio: `${ratio}` }}
                data-active={index === activeIndex ? "true" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={fillTemplate(labels.photoAlt, {
                    title,
                    index: index + 1,
                    count,
                  })}
                  className="listing-gallery__image"
                  draggable={false}
                  loading={index === 0 ? "eager" : "lazy"}
                  onLoad={(event) => {
                    const { naturalWidth, naturalHeight } = event.currentTarget;
                    if (naturalWidth > 0 && naturalHeight > 0) {
                      setRatio(index, naturalWidth / naturalHeight);
                    }
                  }}
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                    event.currentTarget.removeAttribute("src");
                  }}
                />
              </figure>
            );
          })}
        </div>

        {showChrome ? (
          <>
            <button
              type="button"
              className="listing-gallery__nav listing-gallery__nav--prev"
              aria-label={labels.prev}
              disabled={!canPrev}
              onClick={goPrev}
            >
              <Chevron direction="left" className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="listing-gallery__nav listing-gallery__nav--next"
              aria-label={labels.next}
              disabled={!canNext}
              onClick={goNext}
            >
              <Chevron direction="right" className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <div className="listing-gallery__chrome">
          <button
            ref={viewAllRef}
            type="button"
            className="listing-gallery__view-all"
            onClick={() => setLightboxOpen(true)}
          >
            {chrome.viewAll}
          </button>
          {showChrome ? (
            <div className="listing-gallery__counter" aria-live="polite">
              {activeIndex + 1} / {count}
            </div>
          ) : null}
        </div>
      </div>

      {showChrome ? (
        <ul className="listing-gallery__thumbs">
          {urls.map((url, index) => {
            const selected = index === activeIndex;
            return (
              <li key={`thumb-${url}-${index}`}>
                <button
                  ref={(node) => {
                    thumbRefs.current[index] = node;
                  }}
                  type="button"
                  className={
                    selected
                      ? "listing-gallery__thumb listing-gallery__thumb--active"
                      : "listing-gallery__thumb"
                  }
                  data-index={index}
                  aria-label={fillTemplate(labels.view, { index: index + 1 })}
                  aria-current={selected ? "true" : undefined}
                  onClick={(event) => {
                    const raw = event.currentTarget.dataset.index;
                    const next = raw == null ? index : Number(raw);
                    if (!Number.isFinite(next)) return;
                    goTo(next, "auto");
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" draggable={false} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {lightbox}
    </div>
  );
}
