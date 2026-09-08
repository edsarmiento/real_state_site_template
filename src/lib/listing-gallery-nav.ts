export function wrapGalleryIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return ((index % count) + count) % count;
}

export function galleryIndexAfterKey(
  key: string,
  index: number,
  count: number,
): number | null {
  if (count <= 1) return null;
  if (key === "ArrowLeft") return wrapGalleryIndex(index - 1, count);
  if (key === "ArrowRight") return wrapGalleryIndex(index + 1, count);
  return null;
}
