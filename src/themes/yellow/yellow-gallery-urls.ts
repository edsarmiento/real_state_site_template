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
