import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ResolvedSiteConfig } from "../lib/site-config-types";
import { themePropsFromConfig } from "./resolve-theme-props";

const config = {
  accountId: 7,
  layoutKey: "yellow",
  siteName: "Demo",
  siteTagline: "Tag",
  siteLogoUrl: null,
  showPoweredBy: false,
  showShareButton: false,
  siteOrigin: "https://demo.test",
  locale: {
    defaultLocale: "es",
    supportedLocales: ["es"],
    showLocaleSwitcher: false,
  },
  source: "env",
} as ResolvedSiteConfig;

describe("themePropsFromConfig", () => {
  it("builds content from the provided config and falls back invalid lang", () => {
    const props = themePropsFromConfig(config, "en");
    assert.equal(props.config, config);
    assert.equal(props.locale, "es");
    assert.equal(props.content.brand.name, "Demo");
    assert.equal(props.content.brand.tagline, "Tag");
    assert.equal(props.content.locale.defaultLocale, "es");
    assert.equal(props.content.locale.showLocaleSwitcher, false);
    assert.deepEqual(props.content.locale.supportedLocales, ["es"]);
  });

  it("uses default locale when lang is empty", () => {
    assert.equal(themePropsFromConfig(config, "").locale, "es");
    assert.equal(themePropsFromConfig(config, undefined).locale, "es");
  });

  it("keeps an allowed non-default locale when requested", () => {
    const bilingual = {
      ...config,
      locale: {
        defaultLocale: "es" as const,
        supportedLocales: ["es", "en"] as ("es" | "en")[],
        showLocaleSwitcher: true,
      },
    };
    const props = themePropsFromConfig(bilingual, "en");
    assert.equal(props.locale, "en");
    assert.equal(props.content.locale.showLocaleSwitcher, true);
  });

  it("mirrors config.locale onto content.locale (same reference)", () => {
    const props = themePropsFromConfig(config, "es");
    assert.equal(props.content.locale, config.locale);
  });
});
