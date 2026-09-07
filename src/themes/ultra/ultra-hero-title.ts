export type UltraHeroTitleParts = {
  lead: string;
  accent: string;
};

/**
 * Splits the hero title so the last word can be rendered in serif italic.
 * Presentational only: no word is added, removed or reordered.
 */
export function ultraHeroTitleParts(title: string): UltraHeroTitleParts {
  const clean = title.trim().replace(/\s+/g, " ");
  if (!clean) return { lead: "", accent: "" };
  const words = clean.split(" ");
  if (words.length < 2) return { lead: "", accent: clean };
  return {
    lead: words.slice(0, -1).join(" "),
    accent: words[words.length - 1],
  };
}

/** First unique photo URLs, skipping blanks and exact duplicates. */
export function uniquePhotoUrls(
  urls: readonly string[] | undefined,
  limit = 3,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls ?? []) {
    const url = raw.trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
    if (out.length >= limit) break;
  }
  return out;
}
