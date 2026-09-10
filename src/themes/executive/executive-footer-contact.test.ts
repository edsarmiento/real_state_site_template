import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  executiveFooterContactChannels,
  executiveHasVisibleContact,
  normalizeExecutiveFooterContact,
} from "./executive-footer-contact.ts";

const WA_LABEL = "WhatsApp";

describe("normalizeExecutiveFooterContact", () => {
  it("treats missing and whitespace-only values as null", () => {
    assert.deepEqual(
      normalizeExecutiveFooterContact({
        whatsappHref: "   ",
        phone: " ",
        phoneHref: undefined,
        email: null,
        emailHref: "\t",
      }),
      {
        whatsappHref: null,
        phone: null,
        phoneHref: null,
        email: null,
        emailHref: null,
      },
    );
  });

  it("trims outer whitespace from valid values", () => {
    assert.deepEqual(
      normalizeExecutiveFooterContact({
        whatsappHref: " https://wa.me/521 ",
        phone: " +52 55 1234 ",
        phoneHref: " tel:+52551234 ",
        email: " a@example.com ",
        emailHref: " mailto:a@example.com ",
      }),
      {
        whatsappHref: "https://wa.me/521",
        phone: "+52 55 1234",
        phoneHref: "tel:+52551234",
        email: "a@example.com",
        emailHref: "mailto:a@example.com",
      },
    );
  });
});

describe("executiveFooterContactChannels", () => {
  it("returns no channels when all contacts are absent", () => {
    const contact = normalizeExecutiveFooterContact({});
    assert.deepEqual(
      executiveFooterContactChannels(contact, { whatsapp: WA_LABEL }),
      [],
    );
  });

  it("returns no channels for whitespace-only inputs", () => {
    const contact = normalizeExecutiveFooterContact({
      whatsappHref: "   ",
      phone: "  ",
      phoneHref: " tel:1 ",
      email: " ",
      emailHref: " mailto:a@example.com ",
    });
    assert.deepEqual(
      executiveFooterContactChannels(contact, { whatsapp: WA_LABEL }),
      [],
    );
  });

  it("keeps WhatsApp as the only channel when it is valid", () => {
    const contact = normalizeExecutiveFooterContact({
      whatsappHref: "https://wa.me/521",
      email: " ",
      emailHref: "mailto:a@example.com",
    });
    assert.deepEqual(
      executiveFooterContactChannels(contact, { whatsapp: WA_LABEL }),
      [
        {
          kind: "whatsapp",
          href: "https://wa.me/521",
          label: WA_LABEL,
        },
      ],
    );
  });

  it("includes complete email and complete phone channels", () => {
    const contact = normalizeExecutiveFooterContact({
      email: "a@example.com",
      emailHref: "mailto:a@example.com",
      phone: "+52 1",
      phoneHref: "tel:+521",
    });
    assert.deepEqual(
      executiveFooterContactChannels(contact, { whatsapp: WA_LABEL }),
      [
        {
          kind: "email",
          href: "mailto:a@example.com",
          label: "a@example.com",
        },
        {
          kind: "phone",
          href: "tel:+521",
          label: "+52 1",
        },
      ],
    );
  });

  it("omits text without href and href without text", () => {
    const contact = normalizeExecutiveFooterContact({
      email: "a@example.com",
      phoneHref: "tel:+521",
    });
    assert.deepEqual(
      executiveFooterContactChannels(contact, { whatsapp: WA_LABEL }),
      [],
    );
  });

  it("keeps a valid phone and ignores whitespace-only email pair", () => {
    const contact = normalizeExecutiveFooterContact({
      phone: "+52 1",
      phoneHref: "tel:+521",
      email: "a@example.com",
      emailHref: "   ",
    });
    assert.deepEqual(
      executiveFooterContactChannels(contact, { whatsapp: WA_LABEL }),
      [
        {
          kind: "phone",
          href: "tel:+521",
          label: "+52 1",
        },
      ],
    );
  });

  it("never emits empty href or blank labels for valid trimmed values", () => {
    const contact = normalizeExecutiveFooterContact({
      whatsappHref: " https://wa.me/521 ",
      email: " a@example.com ",
      emailHref: " mailto:a@example.com ",
      phone: " +52 1 ",
      phoneHref: " tel:+521 ",
    });
    const channels = executiveFooterContactChannels(contact, {
      whatsapp: WA_LABEL,
    });
    assert.equal(channels.length, 3);
    for (const channel of channels) {
      assert.ok(channel.href.trim().length > 0);
      assert.ok(channel.label.trim().length > 0);
      assert.equal(channel.href, channel.href.trim());
      assert.equal(channel.label, channel.label.trim());
    }
  });
});

describe("executiveHasVisibleContact", () => {
  it("matches channel visibility rules", () => {
    assert.equal(executiveHasVisibleContact({}), false);
    assert.equal(
      executiveHasVisibleContact({ whatsappHref: "https://wa.me/521" }),
      true,
    );
    assert.equal(
      executiveHasVisibleContact({
        email: "a@example.com",
        emailHref: "mailto:a@example.com",
      }),
      true,
    );
    assert.equal(
      executiveHasVisibleContact({
        phone: "+52 1",
        phoneHref: "tel:+521",
        email: "a@example.com",
        emailHref: "   ",
      }),
      true,
    );
    assert.equal(
      executiveHasVisibleContact({
        emailHref: "mailto:a@example.com",
        phoneHref: "tel:+521",
      }),
      false,
    );
  });
});
