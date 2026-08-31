export type ListingTitleDisplay = {
  original: string;
  visual: string;
  leadingDecorations: string | null;
  trailingDecorations: string | null;
};

/**
 * Presentational split for listing titles that begin or end with decorative
 * emoji. Does not mutate stored data, slugs, or API values.
 *
 * Decision: only edge Extended_Pictographic sequences are treated as
 * decoration. If stripping them would leave an empty title, the original is
 * kept as the visual text. Internal emoji and ordinary characters are
 * never consumed.
 */
const PICTO =
  String.raw`(?:\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*)`;
const LEADING_DECORATION = new RegExp(`^(?:${PICTO}\\s*)+`, "u");
const TRAILING_DECORATION = new RegExp(`(?:\\s*${PICTO})+$`, "u");

export function splitLeadingDecorativeEmojis(
  title: string,
): ListingTitleDisplay {
  const original = title;
  const empty = {
    original,
    visual: title,
    leadingDecorations: null,
    trailingDecorations: null,
  };
  if (!title) return empty;

  let visual = title;
  let leadingDecorations: string | null = null;
  let trailingDecorations: string | null = null;

  const leading = title.match(LEADING_DECORATION);
  if (leading) {
    const next = title.slice(leading[0].length);
    if (next.trim()) {
      visual = next;
      leadingDecorations = leading[0].trim() || null;
    }
  }

  const trailing = visual.match(TRAILING_DECORATION);
  if (trailing) {
    const next = visual.slice(0, visual.length - trailing[0].length);
    if (next.trim()) {
      visual = next;
      trailingDecorations = trailing[0].trim() || null;
    }
  }

  return { original, visual, leadingDecorations, trailingDecorations };
}
