import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PublicSiteContent } from "../../lib/public-site-content";
import { executiveContactChannels } from "./executive-contact-channels.ts";

function channels(primary: string | null, fallback: string | null) {
  const content = {
    whatsapp: { number: primary, href: primary },
    contact: {
      whatsappNumber: fallback,
      whatsappHref: fallback,
      phone: null,
      phoneHref: null,
    },
  } as PublicSiteContent;
  return executiveContactChannels(content);
}

describe("Executive WhatsApp fallback", () => {
  for (const primary of [null, "", "  "]) {
    it(`uses trimmed contact data when primary is ${JSON.stringify(primary)}`, () => {
      const result = channels(primary, " fallback ");
      assert.equal(result.whatsappNumber, "fallback");
      assert.equal(result.whatsappHref, "fallback");
    });
  }

  it("keeps a valid primary ahead of fallback", () => {
    const result = channels(" primary ", "fallback");
    assert.equal(result.whatsappNumber, "primary");
    assert.equal(result.whatsappHref, "primary");
  });

  it("returns null when both candidates are absent", () => {
    const result = channels("  ", "  ");
    assert.equal(result.whatsappNumber, null);
    assert.equal(result.whatsappHref, null);
  });
});
