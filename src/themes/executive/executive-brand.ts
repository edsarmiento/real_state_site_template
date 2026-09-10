import type { SiteLocale } from "@/lib/site-i18n";

export function executiveBrandInitial(name: string): string {
  const match = name.trim().match(/[\p{L}\p{N}]/u);
  return match ? match[0].toLocaleUpperCase("es-MX") : "·";
}

export function resolveExecutiveCurrency(currency?: string | null): string {
  const value = currency?.trim().toUpperCase() ?? "";
  if (/^[A-Z]{3}$/.test(value)) return value;
  return "MXN";
}

export function formatExecutivePriceParts(
  cents: number,
  currency: string | null | undefined,
  locale: SiteLocale,
): { amount: string; currency: string } {
  const code = resolveExecutiveCurrency(currency);
  const grouped = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(cents / 100));
  return { amount: `$${grouped}`, currency: code };
}
