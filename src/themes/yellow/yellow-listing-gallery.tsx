"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ListingPhotoGallery, type ListingGalleryLabels } from "@/components/listing-photo-gallery";
import {
  galleryIndexAfterKey,
  wrapGalleryIndex,
} from "@/lib/listing-gallery-nav";
import type { ListingPhoto } from "@/lib/listing-types";
import { fillTemplate } from "@/lib/site-i18n";
import { yellowGalleryUrlAfterFailure } from "@/themes/yellow/yellow-gallery-urls";
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
  expandLabel: string;
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
  expandLabel,
  closeLabel,
}: Props) {
  const sourceUrls = galleryUrls(photos, fallbackUrl);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(() => new Set());
  const urls = sourceUrls.filter((url) => !failedUrls.has(url));
  const count = urls.length;
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const expandRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const activeUrl =
    (selectedUrl && urls.includes(selectedUrl) ? selectedUrl : null) ??
    urls[0] ??
    null;
  const safeIndex = activeUrl ? Math.max(0, urls.indexOf(activeUrl)) : 0;
  const lightboxOpen = open && Boolean(activeUrl);

  function markUrlFailed(url: string) {
    setFailedUrls((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
    setSelectedUrl((current) => yellowGalleryUrlAfterFailure(urls, url, current));
  }

  function openLightbox() {
    setSelectedUrl(urls[0] ?? null);
    setOpen(true);
  }

  function showUrlAt(nextIndex: number) {
    setSelectedUrl(urls[nextIndex] ?? null);
  }

  function closeLightbox() {
    setOpen(false);
  }

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
      const next = galleryIndexAfterKey(event.key, safeIndex, count);
      if (next == null) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setSelectedUrl(urls[next] ?? null);
    }

    window.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [lightboxOpen, count, safeIndex, urls]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const expandButton = expandRef.current;
    return () => {
      expandButton?.focus();
    };
  }, [lightboxOpen]);

  return (
    <div className="yellow-gallery-wrap">
      <ListingPhotoGallery
        title={title}
        photos={photos}
        fallbackUrl={fallbackUrl}
        className="yellow-gallery"
        styledLayout={false}
        labels={labels}
      />
      <span className="yellow-gallery__badge">{offerLabel}</span>
      {count > 0 ? (
        <button
          ref={expandRef}
          type="button"
          className="yellow-gallery__expand"
          onClick={openLightbox}
          aria-haspopup="dialog"
          aria-expanded={lightboxOpen}
          aria-controls={dialogId}
        >
          <YellowIconExpand className="h-4 w-4" />
          {expandLabel}
        </button>
      ) : null}

      {count > 0 && activeUrl ? (
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
              {count > 1 ? (
                <>
                  <button
                    type="button"
                    className="yellow-lightbox__nav yellow-lightbox__nav--prev"
                    onClick={() => showUrlAt(wrapGalleryIndex(safeIndex - 1, count))}
                    aria-label={labels.prev}
                  >
                    <YellowIconArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="yellow-lightbox__nav yellow-lightbox__nav--next"
                    onClick={() => showUrlAt(wrapGalleryIndex(safeIndex + 1, count))}
                    aria-label={labels.next}
                  >
                    <YellowIconArrowRight className="h-5 w-5" />
                  </button>
                  <p className="yellow-lightbox__counter">
                    {safeIndex + 1} / {count}
                  </p>
                </>
              ) : null}
            </div>
            {count > 1 ? (
              <ul className="yellow-lightbox__thumbs">
                {urls.map((url, photoIndex) => {
                  const selected = photoIndex === safeIndex;
                  return (
                    <li key={`${url}-${photoIndex}`}>
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
                        onClick={() => showUrlAt(photoIndex)}
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
