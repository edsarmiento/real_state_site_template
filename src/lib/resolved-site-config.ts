import { cache } from "react";
import { apiBaseUrl } from "@/lib/api-url";
import { envSiteConfig } from "@/lib/site-config-env";
import type {
  ResolvedSiteConfig,
  SiteConfigApiPayload,
  SiteLayoutKey,
} from "@/lib/site-config-types";
import { parseSiteLocaleConfig, type SiteLocaleConfig } from "@/lib/site-i18n";

const LAYOUT_KEYS: SiteLayoutKey[] = ["default", "deo"];

function normalizeLayoutKey(raw: string | undefined | null): SiteLayoutKey {
  const value = raw?.trim().toLowerCase();
  if (value && LAYOUT_KEYS.includes(value as SiteLayoutKey)) {
    return value as SiteLayoutKey;
  }
  return "default";
}

function localeFromApi(
  api: SiteConfigApiPayload,
  env: ResolvedSiteConfig,
): SiteLocaleConfig {
  const branding = api.branding ?? ({} as SiteConfigApiPayload["branding"]);
  const showSwitcher =
    api.locale?.show_locale_switcher ?? branding.show_locale_switcher;

  if (api.locale?.supported_locales?.length) {
    return parseSiteLocaleConfig(
      api.locale.default_locale,
      api.locale.supported_locales.join(","),
      showSwitcher,
    );
  }

  if (branding.supported_locales?.length) {
    return parseSiteLocaleConfig(
      branding.default_locale,
      branding.supported_locales.join(","),
      showSwitcher,
    );
  }

  return env.locale;
}

function mergeApiPayload(
  api: SiteConfigApiPayload,
  env: ResolvedSiteConfig,
): ResolvedSiteConfig {
  const branding = api.branding ?? ({} as SiteConfigApiPayload["branding"]);

  return {
    accountId: api.account_id,
    layoutKey: normalizeLayoutKey(api.layout_key),
    siteName: branding.site_name?.trim() || env.siteName,
    siteTagline: branding.tagline?.trim() || env.siteTagline,
    siteLogoUrl: branding.logo_url?.trim() || env.siteLogoUrl,
    primaryColor: branding.primary_color?.trim() || env.primaryColor,
    showPoweredBy: branding.show_powered_by ?? env.showPoweredBy,
    showShareButton: branding.show_share_button ?? env.showShareButton,
    siteOrigin: api.public_url?.trim() || env.siteOrigin,
    locale: localeFromApi(api, env),
    source: "api",
  };
}

async function fetchSiteConfigFromApi(
  id: number,
): Promise<SiteConfigApiPayload | null> {
  const url = `${apiBaseUrl()}/api/public/site_config?account_id=${id}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as SiteConfigApiPayload;
    return data?.account_id ? data : null;
  } catch {
    return null;
  }
}

export const getResolvedSiteConfig = cache(
  async (): Promise<ResolvedSiteConfig> => {
    const env = envSiteConfig();
    const api = await fetchSiteConfigFromApi(env.accountId);
    if (!api) return env;
    return mergeApiPayload(api, env);
  },
);
