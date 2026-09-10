export type YellowHeroTitleParts = {
  lead: string;
  accent: string;
};

/**
 * Splits the hero title so the last two words render in italic sky-blue,
 * matching yellow.html ("Encuentra tu próximo" + "inmueble exclusivo").
 * Presentational only: no word is added, removed or reordered.
 */
export function yellowHeroTitleParts(title: string): YellowHeroTitleParts {
  const clean = title.trim().replace(/\s+/g, " ");
  if (!clean) return { lead: "", accent: "" };
  const words = clean.split(" ");
  if (words.length === 1) return { lead: "", accent: clean };
  if (words.length === 2) {
    return { lead: words[0], accent: words[1] };
  }
  return {
    lead: words.slice(0, -2).join(" "),
    accent: words.slice(-2).join(" "),
  };
}
