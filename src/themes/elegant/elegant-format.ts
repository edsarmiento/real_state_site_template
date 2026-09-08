import { localizedHref, type SiteLocale } from "@/lib/site-i18n";
import { remapElegantSectionHash } from "@/themes/elegant/elegant-section-hash";

export function elegantContentHref(
  href: string,
  locale: SiteLocale,
  defaultLocale: SiteLocale,
): string {
  const trimmed = href.trim();
  if (!trimmed) return localizedHref("/", locale, null, defaultLocale);
  try {
    const parsed = new URL(trimmed, "https://elegant.local");
    if (parsed.origin !== "https://elegant.local") return trimmed;
    const mapped = remapElegantSectionHash(parsed.hash);
    const path = parsed.pathname === "/" ? "/" : parsed.pathname;
    const withHash = mapped ? `${path}#${mapped}` : path;
    return localizedHref(withHash, locale, parsed.searchParams, defaultLocale);
  } catch {
    return localizedHref(trimmed, locale, null, defaultLocale);
  }
}
