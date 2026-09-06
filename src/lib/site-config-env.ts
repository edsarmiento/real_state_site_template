import type { ResolvedSiteConfig } from "@/lib/site-config-types";
import { parseSiteLocaleConfig } from "@/lib/site-i18n";

const DEFAULT_SITE_NAME = "Inmobiliaria";
const DEFAULT_SITE_TAGLINE =
  "Catálogo de inmuebles en renta y venta.";
const DEFAULT_SITE_ORIGIN = "http://localhost:3002";

/** Server-only: workspace id for this white-label deploy. */
export function accountId(): number {
  const raw = process.env.ACCOUNT_ID?.trim();
  if (!raw || !/^\d+$/.test(raw)) {
    throw new Error(
      "ACCOUNT_ID must be set to the numeric id of the inmobiliaria workspace.",
    );
  }
  return Number(raw);
}

export function envSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return normalizeSiteOrigin(fromEnv);
  return DEFAULT_SITE_ORIGIN;
}

function normalizeSiteOrigin(raw: string): string {
  let value = raw.trim().replace(/\/+$/, "");
  value = value.replace(/^(https?):\/(?!\/)/i, "$1://");
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }
  try {
    const parsed = new URL(value);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return DEFAULT_SITE_ORIGIN;
  }
}

/** Env-only config (fallback when API has no SiteConfig). */
export function envSiteConfig(): ResolvedSiteConfig {
  return {
    accountId: accountId(),
    layoutKey: "default",
    siteName: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || DEFAULT_SITE_NAME,
    siteTagline:
      process.env.NEXT_PUBLIC_SITE_TAGLINE?.trim() || DEFAULT_SITE_TAGLINE,
    siteLogoUrl: process.env.NEXT_PUBLIC_SITE_LOGO_URL?.trim() || null,
    showPoweredBy: process.env.NEXT_PUBLIC_SHOW_POWERED_BY !== "false",
    showShareButton: process.env.NEXT_PUBLIC_SHOW_SHARE_BUTTON !== "false",
    siteOrigin: envSiteOrigin(),
    locale: parseSiteLocaleConfig(
      process.env.SITE_DEFAULT_LOCALE,
      process.env.SITE_SUPPORTED_LOCALES ?? "es",
      process.env.SITE_SHOW_LOCALE_SWITCHER,
    ),
    source: "env",
  };
}

export function listingPublicUrl(
  slug: string,
  origin: string = envSiteOrigin(),
  localizedPath?: string,
): string {
  const path = localizedPath ?? `/inmueble/${encodeURIComponent(slug)}`;
  return new URL(path, origin).href;
}
