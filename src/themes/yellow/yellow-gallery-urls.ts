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
