export type BeigeHeroTitleParts = {
  lead: string;
  accent: string;
};

/**
 * Splits the hero title so the last word can be rendered in serif italic.
 * Purely presentational: no word is added, removed or reordered.
 */
export function beigeHeroTitleParts(title: string): BeigeHeroTitleParts {
  const clean = title.trim().replace(/\s+/g, " ");
  if (!clean) return { lead: "", accent: "" };
  const words = clean.split(" ");
  if (words.length < 2) return { lead: "", accent: clean };
  return {
    lead: words.slice(0, -1).join(" "),
    accent: words[words.length - 1],
  };
}
