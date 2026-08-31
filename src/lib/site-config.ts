/**
 * @deprecated Import from `@/lib/site-config-env` (sync env) or
 * `getResolvedSiteConfig` from `@/lib/resolved-site-config` (API + env).
 */
export {
  accountId,
  envSiteOrigin as siteOrigin,
  envSiteConfig,
  listingPublicUrl,
} from "@/lib/site-config-env";

import { envSiteConfig } from "@/lib/site-config-env";

const env = () => envSiteConfig();

export function siteName(): string {
  return env().siteName;
}

export function siteTagline(): string {
  return env().siteTagline;
}

export function siteLogoUrl(): string | null {
  return env().siteLogoUrl;
}

export function showPoweredBy(): boolean {
  return env().showPoweredBy;
}
