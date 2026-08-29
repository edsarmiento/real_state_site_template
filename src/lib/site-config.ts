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

export function siteName(): string {
  return process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Inmobiliaria";
}

export function siteTagline(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_TAGLINE?.trim() ||
    "Catálogo de inmuebles en renta y venta."
  );
}

export function siteLogoUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SITE_LOGO_URL?.trim();
  return url || null;
}

export function showPoweredBy(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_POWERED_BY !== "false";
}

const DEFAULT_SITE_ORIGIN = "http://localhost:3002";

export function siteOrigin(): string {
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

export function listingPublicUrl(slug: string): string {
  const path = `/inmueble/${encodeURIComponent(slug)}`;
  return new URL(path, siteOrigin()).href;
}
