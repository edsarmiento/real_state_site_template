import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { collectPublicContactChannels, publicContactChannels } from "./public-contact-channels";
import type { PublicSiteContent } from "./public-site-content";
import { getDictionary } from "./site-i18n";

function content(contact: Partial<PublicSiteContent["contact"]> = {}): PublicSiteContent {
  return {
    whatsapp: { number: null, href: null },
    contact: {
      whatsappNumber: null,
      whatsappHref: null,
      phone: null,
      phoneHref: null,
      email: null,
      emailHref: null,
      scheduleCallUrl: null,
      location: null,
      ...contact,
    },
  } as PublicSiteContent;
}

describe("shared public contact channels", () => {
  it("uses the primary WhatsApp link and falls back when absent", () => {
    const input = content({ whatsappHref: "https://wa.me/521" });
    assert.equal(publicContactChannels(input).whatsappHref, "https://wa.me/521");
    input.whatsapp.href = "https://wa.me/522";
    assert.equal(publicContactChannels(input).whatsappHref, "https://wa.me/522");
  });

  it("hides example phones and emails from the rendered channel list", () => {
    const input = content({
      phone: "example phone",
      phoneHref: "tel:123",
      email: "hello@example.com",
      emailHref: "mailto:hello@example.com",
    });
    assert.deepEqual(collectPublicContactChannels(input, getDictionary("es")), []);
  });

  it("keeps a phone link without display text with a localized label", () => {
    for (const locale of ["es", "en"] as const) {
      const dict = getDictionary(locale);
      const channels = collectPublicContactChannels(content({ phoneHref: "tel:123" }), dict);
      assert.equal(channels.length, 1);
      assert.equal(channels[0].href, "tel:123");
      assert.equal(channels[0].value, dict.contact.callUs);
    }
  });

  it("includes scheduling and a static location even without other channels", () => {
    const channels = collectPublicContactChannels(content({
      scheduleCallUrl: "https://calendar.example/booking",
      location: "Oficina central",
    }), getDictionary("es"));
    assert.deepEqual(channels.map(({ key, href, external, icon }) => ({ key, href, external, icon })), [
      { key: "schedule", href: "https://calendar.example/booking", external: true, icon: "schedule" },
      { key: "location", href: null, external: undefined, icon: "location" },
    ]);
  });
});
