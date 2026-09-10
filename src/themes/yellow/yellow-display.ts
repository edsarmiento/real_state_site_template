/** Display-only helpers. Do not persist or send these transformed values. */

export function displayListingTitle(title: string): string {
  return title
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\uFE0F/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function brandInitial(name: string): string {
  const clean = name.trim();
  if (!clean) return "";
  return Array.from(clean)[0]?.toLocaleUpperCase() ?? "";
}

export const YELLOW_LOGO_NAV_CLASS = "yellow-logo--nav";
export const YELLOW_LOGO_FOOTER_CLASS = "yellow-logo--footer";
