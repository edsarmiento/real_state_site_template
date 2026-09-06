import type { ResolvedSiteConfig, SiteBranding } from "@/lib/site-config-types";

export function pickSiteBranding(config: ResolvedSiteConfig): SiteBranding {
  return {
    siteName: config.siteName,
    siteTagline: config.siteTagline,
    siteLogoUrl: config.siteLogoUrl,
    showPoweredBy: config.showPoweredBy,
  };
}
