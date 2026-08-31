export type SiteLayoutKey = "default" | "deo";

export type SiteConfigBranding = {
  site_name: string;
  tagline: string;
  logo_url: string | null;
  primary_color: string | null;
  show_powered_by: boolean;
};

/** JSON from GET /api/public/site_config */
export type SiteConfigApiPayload = {
  account_id: number;
  layout_key: SiteLayoutKey | string;
  public_url: string | null;
  status: string;
  branding: SiteConfigBranding;
  persisted: boolean;
};

export type ResolvedSiteConfig = {
  accountId: number;
  layoutKey: SiteLayoutKey;
  siteName: string;
  siteTagline: string;
  siteLogoUrl: string | null;
  primaryColor: string | null;
  showPoweredBy: boolean;
  siteOrigin: string;
  /** Whether values came from the API or env fallbacks only. */
  source: "api" | "env";
};

export type SiteBranding = Pick<
  ResolvedSiteConfig,
  "siteName" | "siteTagline" | "siteLogoUrl" | "primaryColor" | "showPoweredBy"
>;
