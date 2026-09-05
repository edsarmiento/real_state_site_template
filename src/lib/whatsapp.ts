export function parseWhatsAppNumber(
  raw: string | undefined | null,
): string | null {
  if (raw == null) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return null;
  if (digits.length === 10) return `52${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  console.warn("[site-content] Invalid WhatsApp number; ignoring.");
  return null;
}

export function buildWhatsAppHref(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
