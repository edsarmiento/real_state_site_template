/** Last 10 digits for MX local display/editing (strips country code). */
export function toMxLocalPhone(raw: string | null | undefined): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}
