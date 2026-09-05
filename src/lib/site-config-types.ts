import type { SiteLocaleConfig } from "@/lib/site-i18n";
import type { SiteLayoutKey } from "@/themes/theme-definitions";

export type { SiteLayoutKey } from "@/themes/theme-definitions";

export type SiteConfigBranding = {
  site_name: string;
  tagline: string;
  logo_url: string | null;
  primary_color: string | null;
  show_powered_by: boolean;
  show_share_button?: boolean;
  default_locale?: string;
  supported_locales?: string[];
  show_locale_switcher?: boolean;
};

/** JSON from GET /api/public/site_config */
export type SiteConfigApiPayload = {
  account_id: number;
  layout_key: SiteLayoutKey | string;
  public_url: string | null;
  status: string;
  branding: SiteConfigBranding;
  locale?: {
    default_locale: string;
    supported_locales: string[];
    show_locale_switcher?: boolean;
  };
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
  showShareButton: boolean;
  siteOrigin: string;
  locale: SiteLocaleConfig;
  /** Whether values came from the API or env fallbacks only. */
  source: "api" | "env";
};

export type SiteBranding = Pick<
  ResolvedSiteConfig,
  "siteName" | "siteTagline" | "siteLogoUrl" | "primaryColor" | "showPoweredBy"
>;
