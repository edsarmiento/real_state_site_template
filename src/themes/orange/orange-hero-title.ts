export type OrangeHeroTitleParts = {
  before: string;
  accent: string;
  after: string;
};

/**
 * Splits the hero title so the editorial fragment renders italic/terracotta.
 * When the configured accent is not part of a title coming from SiteConfig,
 * the closing words are used so the fragment never disappears.
 */
export function orangeHeroTitleParts(
  title: string,
  accent: string,
): OrangeHeroTitleParts {
  const trimmed = title.trim();
  const needle = accent.trim();
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

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) return { before: trimmed, accent: "", after: "" };

  const tail = words.slice(words.length >= 3 ? -2 : -1).join(" ");
  const tailAt = trimmed.lastIndexOf(tail);
  return {
    before: trimmed.slice(0, tailAt),
    accent: tail,
    after: trimmed.slice(tailAt + tail.length),
  };
}
