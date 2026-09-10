export type DarkHeroTitleParts = {
  lead: string;
  accent: string;
};

/**
 * Splits the hero title so the last two words (or the last word) render in
 * italic gold, matching the HTML. No word is added, removed or reordered.
 */
export function darkHeroTitleParts(title: string): DarkHeroTitleParts {
  const clean = title.trim().replace(/\s+/g, " ");
  if (!clean) return { lead: "", accent: "" };
  const words = clean.split(" ");
  if (words.length === 1) return { lead: "", accent: clean };
  if (words.length < 4) {
    return {
      lead: words.slice(0, -1).join(" "),
      accent: words[words.length - 1] ?? "",
    };
  }
  return {
    lead: words.slice(0, -2).join(" "),
    accent: words.slice(-2).join(" "),
  };
}
