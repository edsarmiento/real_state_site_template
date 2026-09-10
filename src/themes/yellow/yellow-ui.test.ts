import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PublicSiteContent } from "../../lib/public-site-content";
import type { ResolvedSiteConfig } from "../../lib/site-config-types";
import { getYellowUi } from "./yellow-ui";

const content = {
  brand: { name: "Agencia Demo" },
  locale: {
    defaultLocale: "es",
    supportedLocales: ["es", "en"],
    showLocaleSwitcher: true,
  },
  motion: { preset: "subtle" },
} as PublicSiteContent;

const config = {
  accountId: 42,
  showShareButton: true,
  siteOrigin: "https://example.test",
  locale: content.locale,
} as ResolvedSiteConfig;

describe("getYellowUi", () => {
  it("derives dict and public config fields without resolving data", () => {
    const ui = getYellowUi({ content, config, locale: "en" });
    assert.equal(typeof (ui as { then?: unknown }).then, "undefined");
    assert.equal(ui.locale, "en");
    assert.equal(ui.defaultLocale, "es");
    assert.equal(ui.content, content);
    assert.equal(ui.showShareButton, true);
    assert.equal(ui.siteOrigin, "https://example.test");
    assert.equal(typeof ui.dict.nav.properties, "string");
  });

  it("keeps the provided locale without re-applying supportedLocales", () => {
    const mono = {
      ...content,
      locale: {
        defaultLocale: "es" as const,
        supportedLocales: ["es"] as ("es" | "en")[],
        showLocaleSwitcher: false,
      },
    };
    const ui = getYellowUi({
      content: mono,
      config: { ...config, locale: mono.locale },
      locale: "en",
    });
    // Integration resolves locale; a pure getYellowUi must not fall back to "es".
    assert.equal(ui.locale, "en");
    assert.equal(ui.defaultLocale, "es");
    assert.equal(ui.dict.localeName.length > 0, true);
  });

  it("does not expose accountId or the full config object on YellowUi", () => {
    const ui = getYellowUi({ content, config, locale: "es" });
    assert.equal(
      Object.prototype.hasOwnProperty.call(ui, "accountId"),
      false,
    );
    assert.equal(
      Object.prototype.hasOwnProperty.call(ui, "config"),
      false,
    );
    assert.deepEqual(Object.keys(ui).sort(), [
      "content",
      "defaultLocale",
      "dict",
      "locale",
      "showShareButton",
      "siteOrigin",
    ]);
  });
});
