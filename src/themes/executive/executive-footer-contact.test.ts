import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { executiveHasVisibleContact } from "./executive-footer-contact.ts";

describe("executiveHasVisibleContact", () => {
  it("returns false when only hrefs exist without display values", () => {
    assert.equal(
      executiveHasVisibleContact({
        emailHref: "mailto:a@example.com",
        phoneHref: "tel:+521",
      }),
      false,
    );
  });

  it("requires both phone and phoneHref", () => {
    assert.equal(
      executiveHasVisibleContact({
        phone: "+52 1",
        phoneHref: "tel:+521",
      }),
      true,
    );
    assert.equal(
      executiveHasVisibleContact({
        phone: "+52 1",
      }),
      false,
    );
  });

  it("requires both email and emailHref", () => {
    assert.equal(
      executiveHasVisibleContact({
        email: "a@example.com",
        emailHref: "mailto:a@example.com",
      }),
      true,
    );
  });

  it("accepts WhatsApp alone", () => {
    assert.equal(
      executiveHasVisibleContact({
        whatsappHref: "https://wa.me/521",
      }),
      true,
    );
  });

  it("treats blank WhatsApp or contact fields as absent", () => {
    assert.equal(
      executiveHasVisibleContact({
        whatsappHref: "   ",
        email: " ",
        emailHref: " mailto:a@example.com ",
        phone: "1",
        phoneHref: " ",
      }),
      false,
    );
  });
});
