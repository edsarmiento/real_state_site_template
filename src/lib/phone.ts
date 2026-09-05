export const MX_LOCAL_PHONE = /^\d{10}$/;

export function onlyPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function isMxLocalPhone(value: string): boolean {
  return MX_LOCAL_PHONE.test(value);
}

/** Last 10 digits for MX local display/editing (strips country code). */
export function toMxLocalPhone(raw: string | null | undefined): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}
