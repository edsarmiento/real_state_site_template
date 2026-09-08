export type ElegantHeroTitleParts = {
  before: string;
  accent: string;
  after: string;
};

/**
 * Splits the hero title so the editorial fragment can render in Great Vibes.
 * When the configured accent is missing, the last two words are used.
 */
export function elegantHeroTitleParts(
  title: string,
  accent = "",
): ElegantHeroTitleParts {
  const trimmed = title.trim().replace(/\s+/g, " ");
  const needle = accent.trim().replace(/\s+/g, " ");
  const at = needle
    ? trimmed.toLowerCase().indexOf(needle.toLowerCase())
    : -1;
  if (at >= 0) {
    return {
      before: trimmed.slice(0, at),
      accent: trimmed.slice(at, at + needle.length),
      after: trimmed.slice(at + needle.length),
    };
  }

  const words = trimmed.split(" ").filter(Boolean);
  if (words.length < 2) return { before: trimmed, accent: "", after: "" };

  const tail = words.slice(words.length >= 3 ? -2 : -1).join(" ");
  const tailAt = trimmed.lastIndexOf(tail);
  return {
    before: trimmed.slice(0, tailAt),
    accent: tail,
    after: trimmed.slice(tailAt + tail.length),
  };
}
