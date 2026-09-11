/**
 * Detects placeholder contact values from docs / `.env.example`
 * (RFC 2606 example domains and strings containing "example").
 */

export function isExamplePhone(value: string | null | undefined): boolean {
  const phone = value?.trim() ?? "";
  if (!phone) return false;
  return /example/i.test(phone);
}

export function isExampleEmail(value: string | null | undefined): boolean {
  const email = value?.trim() ?? "";
  if (!email) return false;
  return /\.example\b/i.test(email) || /@example\./i.test(email);
}
