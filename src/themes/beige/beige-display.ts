/** Display-only helpers. Do not persist or send these transformed values. */

export function displayListingTitle(title: string): string {
  return title
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\uFE0F/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatBeigePhoneDisplay(raw: string): string {
  const digits = digitsOnly(raw);
  if (digits.length === 12 && digits.startsWith("52")) {
    return `+52 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return raw.trim();
}

export const BEIGE_LOGO_NAV_CLASS =
  "h-14 max-h-16 w-auto max-w-[12rem] object-contain object-left sm:h-16 sm:max-h-[4.5rem] sm:max-w-[16rem] md:h-[4.5rem] md:max-h-20 md:max-w-[18rem] lg:h-20 lg:max-h-20 lg:max-w-[20rem]";

export const BEIGE_LOGO_FOOTER_CLASS =
  "mb-5 h-14 max-h-16 w-auto max-w-[16rem] object-contain object-left sm:h-16 sm:max-h-[4.5rem] sm:max-w-[18rem]";
