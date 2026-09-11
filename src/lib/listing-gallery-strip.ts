import { getDictionary, type SiteLocale } from "@/lib/site-i18n";

export type ListingGalleryStripChrome = {
  viewAll: string;
  close: string;
  lightbox: string;
};

export function listingGalleryStripChrome(
  locale: SiteLocale,
): ListingGalleryStripChrome {
  const { viewAll, close, lightbox } = getDictionary(locale).listing.gallery;
  return { viewAll, close, lightbox };
}

/** Fallback ratio before natural dimensions load (landscape bias). */
export const LISTING_GALLERY_STRIP_FALLBACK_RATIO = 4 / 3;

export function listingGallerySlideWidthPx(
  stripHeightPx: number,
  ratio: number,
): number {
  if (
    !Number.isFinite(stripHeightPx) ||
    !Number.isFinite(ratio) ||
    stripHeightPx <= 0 ||
    ratio <= 0
  ) {
    return stripHeightPx * LISTING_GALLERY_STRIP_FALLBACK_RATIO;
  }
  return stripHeightPx * ratio;
}

export function listingGalleryCanGoPrev(activeIndex: number): boolean {
  return activeIndex > 0;
}

export function listingGalleryCanGoNext(
  activeIndex: number,
  count: number,
): boolean {
  return count > 1 && activeIndex < count - 1;
}

/** Clamp to [0, count-1] — strip galleries do not wrap. */
export function clampGalleryIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.max(0, Math.min(count - 1, index));
}

export function galleryIndexAfterKeyClamped(
  key: string,
  index: number,
  count: number,
): number | null {
  if (count <= 1) return null;
  if (key === "ArrowLeft") {
    return listingGalleryCanGoPrev(index) ? index - 1 : null;
  }
  if (key === "ArrowRight") {
    return listingGalleryCanGoNext(index, count) ? index + 1 : null;
  }
  return null;
}
