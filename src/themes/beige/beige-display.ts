/** Display-only helpers. Do not persist or send these transformed values. */

export function displayListingTitle(title: string): string {
  return title
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\uFE0F/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export const BEIGE_LOGO_NAV_CLASS =
  "beige-logo--nav";

export const BEIGE_LOGO_FOOTER_CLASS = "beige-logo--footer";
