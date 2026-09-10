"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { ListingGalleryLabels } from "@/components/listing-photo-gallery";
import type { ListingPhoto } from "@/lib/listing-types";
import { fillTemplate } from "@/lib/site-i18n";
import {
  YELLOW_GALLERY_ASPECT_FALLBACK,
  clampYellowGalleryIndex,
  computeYellowGalleryTrackOffset,
  shouldHandleYellowGalleryArrowKey,
  yellowGalleryUrlAfterFailure,
  yellowGalleryUrlsKey,
} from "@/themes/yellow/yellow-gallery-urls";
import {
  YellowIconArrowLeft,
  YellowIconArrowRight,
  YellowIconClose,
  YellowIconExpand,
} from "@/themes/yellow/yellow-icons";

type Props = {
  title: string;
  photos: ListingPhoto[];
  fallbackUrl?: string | null;
  labels: ListingGalleryLabels;
  offerLabel: string;
  viewAllLabel: string;
  closeLabel: string;
};

function galleryUrls(
  photos: ListingPhoto[],
  fallbackUrl?: string | null,
): string[] {
  const urls = photos
    .map((photo) => photo.url?.trim() ?? "")
    .filter(Boolean);
  const fallback = fallbackUrl?.trim() ?? "";
  if (urls.length === 0 && fallback) urls.push(fallback);
  return urls;
}

export function YellowListingGallery({
  title,
  photos,
  fallbackUrl,
  labels,
  offerLabel,
  viewAllLabel,
  closeLabel,
}: Props) {
  const sourceUrls = galleryUrls(photos, fallbackUrl);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(() => new Set());
  const [aspectByUrl, setAspectByUrl] = useState<Record<string, number>>({});
  const urls = sourceUrls.filter((url) => !failedUrls.has(url));
  const urlsKey = yellowGalleryUrlsKey(urls);
  const count = urls.length;
  const multi = count > 1;

  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const regionId = `${dialogId}-region`;
  const viewAllRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartX = useRef<number | null>(null);
  const focusReturnRef = useRef<HTMLElement | null>(null);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);

  const safeIndex = clampYellowGalleryIndex(index, count);
  const activeUrl = urls[safeIndex] ?? null;
  const lightboxOpen = open && Boolean(activeUrl);
  const canPrev = multi && safeIndex > 0;
  const canNext = multi && safeIndex < count - 1;

  function markUrlFailed(url: string) {
    const nextSelected = yellowGalleryUrlAfterFailure(urls, url, activeUrl);
    setFailedUrls((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
    setAspectByUrl((prev) => {
      if (!(url in prev)) return prev;
      const next = { ...prev };
      delete next[url];
      return next;
    });
    const remaining = urls.filter((item) => item !== url);
    if (!nextSelected || remaining.length === 0) {
      setIndex(0);
      return;
    }
    const nextIndex = remaining.indexOf(nextSelected);
    setIndex(nextIndex >= 0 ? nextIndex : 0);
  }

  function rememberAspect(url: string, width: number, height: number) {
    if (!(width > 0 && height > 0)) return;
    const ratio = width / height;
    setAspectByUrl((prev) =>
      prev[url] === ratio ? prev : { ...prev, [url]: ratio },
    );
  }

  function goTo(nextIndex: number) {
    if (count <= 0) return;
    setIndex(clampYellowGalleryIndex(nextIndex, count));
  }

  function openLightbox(fromIndex = safeIndex, trigger?: HTMLElement | null) {
    focusReturnRef.current = trigger ?? viewAllRef.current;
    setIndex(clampYellowGalleryIndex(fromIndex, count));
    setOpen(true);
  }

  function closeLightbox() {
    setOpen(false);
  }

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const slide = slideRefs.current[safeIndex];
    if (!viewport || !track || !slide) {
      setTrackOffset(0);
      return;
    }
    setTrackOffset(
      computeYellowGalleryTrackOffset({
        viewportWidth: viewport.clientWidth,
        trackWidth: track.scrollWidth,
        slideOffsetLeft: slide.offsetLeft,
      }),
    );
  }, [safeIndex, urlsKey, aspectByUrl, count]);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;

    if (lightboxOpen && !node.open) {
      node.showModal();
      closeRef.current?.focus();
    }
    if (!lightboxOpen && node.open) {
      node.close();
    }
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") return;
      const target = event.target;
      const targetIsEditable =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      const next = shouldHandleYellowGalleryArrowKey({
        key: event.key,
        index: safeIndex,
        count,
        focusInsideRegion: true,
        targetIsEditable,
      });
      if (next == null) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setIndex(next);
    }

    window.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [lightboxOpen, count, safeIndex]);

  useEffect(() => {
    if (lightboxOpen) return;
    const target = focusReturnRef.current;
    if (!target) return;
    target.focus();
    focusReturnRef.current = null;
  }, [lightboxOpen]);

  useEffect(() => {
    if (lightboxOpen || count <= 1) return;

    function onKey(event: KeyboardEvent) {
      const target = event.target;
      const targetIsEditable =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      const region = document.getElementById(regionId);
      const active = document.activeElement;
      const focusInsideRegion = Boolean(
        region &&
          active instanceof Node &&
          region.contains(active),
      );
      const next = shouldHandleYellowGalleryArrowKey({
        key: event.key,
        index: safeIndex,
        count,
        focusInsideRegion,
        targetIsEditable,
      });
      if (next == null) return;
      event.preventDefault();
      setIndex(next);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, count, safeIndex, regionId]);

  if (count === 0 || !activeUrl) {
    return (
      <div className="yellow-gallery-wrap">
        <div
          className="yellow-gallery yellow-gallery--empty"
          role="status"
          aria-live="polite"
        >
          {labels.empty}
        </div>
        <span className="yellow-gallery__badge">{offerLabel}</span>
      </div>
    );
  }

  return (
    <div className="yellow-gallery-wrap">
      <div
        id={regionId}
        className="yellow-gallery"
        role="region"
        aria-roledescription={labels.carouselRole}
        aria-label={fillTemplate(labels.photosOf, { title })}
      >
        <div
          ref={viewportRef}
          className="yellow-gallery__viewport"
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current == null || !multi) return;
            const endX =
              event.changedTouches[0]?.clientX ?? touchStartX.current;
            const delta = endX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(delta) < 40) return;
            if (delta > 0) goTo(safeIndex - 1);
            else goTo(safeIndex + 1);
          }}
        >
          <div
            ref={trackRef}
            className="yellow-gallery__track"
            style={{ transform: `translate3d(-${trackOffset}px, 0, 0)` }}
          >
            {urls.map((url, photoIndex) => {
              const ratio =
                aspectByUrl[url] ?? YELLOW_GALLERY_ASPECT_FALLBACK;
              const selected = photoIndex === safeIndex;
              const style = {
                "--yellow-slide-ar": String(ratio),
              } as CSSProperties;
              return (
                <button
                  key={`${url}-${photoIndex}`}
                  ref={(node) => {
                    slideRefs.current[photoIndex] = node;
                  }}
                  type="button"
                  className={
                    selected
                      ? "yellow-gallery__slide is-active"
                      : "yellow-gallery__slide"
                  }
                  style={style}
                  aria-current={selected ? "true" : undefined}
                  aria-label={fillTemplate(labels.view, {
                    index: photoIndex + 1,
                  })}
                  onClick={(event) => {
                    if (photoIndex !== safeIndex) {
                      goTo(photoIndex);
                      return;
                    }
                    openLightbox(photoIndex, event.currentTarget);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={fillTemplate(labels.photoAlt, {
                      title,
                      index: photoIndex + 1,
                      count,
                    })}
                    draggable={false}
                    onLoad={(event) => {
                      rememberAspect(
                        url,
                        event.currentTarget.naturalWidth,
                        event.currentTarget.naturalHeight,
                      );
                    }}
                    onError={() => markUrlFailed(url)}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {multi ? (
          <>
            <button
              type="button"
              className="yellow-gallery__nav yellow-gallery__nav--prev"
              onClick={() => goTo(safeIndex - 1)}
              disabled={!canPrev}
              aria-label={labels.prev}
            >
              <YellowIconArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="yellow-gallery__nav yellow-gallery__nav--next"
              onClick={() => goTo(safeIndex + 1)}
              disabled={!canNext}
              aria-label={labels.next}
            >
              <YellowIconArrowRight className="h-5 w-5" />
            </button>
            <div className="yellow-gallery__chrome">
              <p className="yellow-gallery__counter" aria-live="polite">
                {safeIndex + 1} / {count}
              </p>
              <button
                ref={viewAllRef}
                type="button"
                className="yellow-gallery__view-all"
                onClick={(event) =>
                  openLightbox(safeIndex, event.currentTarget)
                }
                aria-haspopup="dialog"
                aria-expanded={lightboxOpen}
                aria-controls={dialogId}
              >
                <YellowIconExpand className="h-4 w-4" />
                {viewAllLabel}
              </button>
            </div>
          </>
        ) : null}
      </div>

      <span className="yellow-gallery__badge">{offerLabel}</span>

      {multi ? (
        <ul className="yellow-gallery__thumbs" aria-label={labels.indicators}>
          {urls.map((url, photoIndex) => {
            const selected = photoIndex === safeIndex;
            return (
              <li key={`${url}-thumb-${photoIndex}`}>
                <button
                  type="button"
                  className={
                    selected
                      ? "yellow-gallery__thumb is-active"
                      : "yellow-gallery__thumb"
                  }
                  aria-current={selected ? "true" : undefined}
                  aria-label={fillTemplate(labels.goTo, {
                    index: photoIndex + 1,
                  })}
                  onClick={() => goTo(photoIndex)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    onLoad={(event) => {
                      rememberAspect(
                        url,
                        event.currentTarget.naturalWidth,
                        event.currentTarget.naturalHeight,
                      );
                    }}
                    onError={() => markUrlFailed(url)}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {activeUrl ? (
        <dialog
          ref={dialogRef}
          id={dialogId}
          className="yellow-lightbox"
          aria-labelledby={titleId}
          onClose={closeLightbox}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
        >
          <div className="yellow-lightbox__dialog">
            <h2 id={titleId} className="yellow-sr-only">
              {fillTemplate(labels.photosOf, { title })}
            </h2>
            <button
              ref={closeRef}
              type="button"
              className="yellow-lightbox__close"
              onClick={closeLightbox}
            >
              <YellowIconClose className="h-5 w-5" />
              {closeLabel}
            </button>
            <div className="yellow-lightbox__stage">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={activeUrl}
                src={activeUrl}
                alt={fillTemplate(labels.photoAlt, {
                  title,
                  index: safeIndex + 1,
                  count,
                })}
                className="yellow-lightbox__image"
                onError={() => markUrlFailed(activeUrl)}
              />
              {multi ? (
                <>
                  <button
                    type="button"
                    className="yellow-lightbox__nav yellow-lightbox__nav--prev"
                    onClick={() => goTo(safeIndex - 1)}
                    disabled={!canPrev}
                    aria-label={labels.prev}
                  >
                    <YellowIconArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="yellow-lightbox__nav yellow-lightbox__nav--next"
                    onClick={() => goTo(safeIndex + 1)}
                    disabled={!canNext}
                    aria-label={labels.next}
                  >
                    <YellowIconArrowRight className="h-5 w-5" />
                  </button>
                  <p className="yellow-lightbox__counter" aria-live="polite">
                    {safeIndex + 1} / {count}
                  </p>
                </>
              ) : null}
            </div>
            {multi ? (
              <ul className="yellow-lightbox__thumbs">
                {urls.map((url, photoIndex) => {
                  const selected = photoIndex === safeIndex;
                  return (
                    <li key={`${url}-lb-${photoIndex}`}>
                      <button
                        type="button"
                        className={
                          selected
                            ? "yellow-lightbox__thumb is-active"
                            : "yellow-lightbox__thumb"
                        }
                        aria-current={selected ? "true" : undefined}
                        aria-label={fillTemplate(labels.view, {
                          index: photoIndex + 1,
                        })}
                        onClick={() => goTo(photoIndex)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          onError={() => markUrlFailed(url)}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
