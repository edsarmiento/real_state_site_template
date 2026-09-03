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

export function sameContactNumber(
  left: string | null | undefined,
  right: string | null | undefined,
): boolean {
  if (!left || !right) return false;
  const a = digitsOnly(left);
  const b = digitsOnly(right);
  if (a.length < 8 || b.length < 8) return false;
  return a.slice(-10) === b.slice(-10);
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
  "h-10 max-h-12 w-auto max-w-[10.5rem] bg-transparent object-contain object-left sm:h-12 sm:max-h-12 sm:max-w-[13rem] md:h-14 md:max-h-16 md:max-w-[15rem] lg:h-16 lg:max-h-16 lg:max-w-[17rem]";

export const BEIGE_LOGO_FOOTER_CLASS =
  "mb-4 h-12 max-h-14 w-auto max-w-[14rem] bg-transparent object-contain object-left sm:h-14 sm:max-h-16 sm:max-w-[16rem]";
