export function yellowGalleryUrlAfterFailure(
  previous: readonly string[],
  failedUrl: string,
  selectedUrl: string | null,
): string | null {
  const remaining = previous.filter((url) => url !== failedUrl);
  if (selectedUrl && selectedUrl !== failedUrl && remaining.includes(selectedUrl)) {
    return selectedUrl;
  }
  const failedIndex = previous.indexOf(failedUrl);
  if (failedIndex < 0) return remaining[0] ?? null;
  return (
    previous.slice(failedIndex + 1).find((url) => remaining.includes(url)) ??
    [...previous.slice(0, failedIndex)]
      .reverse()
      .find((url) => remaining.includes(url)) ??
    remaining[0] ??
    null
  );
}

/** Clamp index to [0, count-1] — Yellow strip/lightbox do not wrap. */
export function clampYellowGalleryIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.max(0, Math.min(count - 1, index));
}

/** Arrow keys without wrap; returns null when at an end or key unused. */
export function yellowGalleryIndexAfterKey(
  key: string,
  index: number,
  count: number,
): number | null {
  if (count <= 1) return null;
  if (key === "ArrowLeft") {
    return index > 0 ? index - 1 : null;
  }
  if (key === "ArrowRight") {
    return index < count - 1 ? index + 1 : null;
  }
  return null;
}

export const YELLOW_GALLERY_ASPECT_FALLBACK = 4 / 3;

/** Stable content key for gallery URL lists (avoids effect churn on new array refs). */
export function yellowGalleryUrlsKey(urls: readonly string[]): string {
  return JSON.stringify(urls);
}

/**
 * Track offset so the active slide is visible without wrapping.
 * Measurements come from the live DOM (viewport/track/slide).
 */
export function computeYellowGalleryTrackOffset(input: {
  viewportWidth: number;
  trackWidth: number;
  slideOffsetLeft: number;
}): number {
  const max = Math.max(0, input.trackWidth - input.viewportWidth);
  return Math.min(Math.max(0, input.slideOffsetLeft), max);
}

/**
 * Strip keyboard handling: only when focus is inside the gallery region
 * (or the event target is inside it). Does not wrap. Ignores editables.
 */
export function shouldHandleYellowGalleryArrowKey(input: {
  key: string;
  index: number;
  count: number;
  focusInsideRegion: boolean;
  targetIsEditable: boolean;
}): number | null {
  if (input.targetIsEditable) return null;
  if (!input.focusInsideRegion) return null;
  return yellowGalleryIndexAfterKey(input.key, input.index, input.count);
}
