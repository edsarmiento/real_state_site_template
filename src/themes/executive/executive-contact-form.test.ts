import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "executive-contact-form.tsx"),
  "utf8",
);

describe("ExecutiveContactForm contract (source)", () => {
  it("uses LegalContent.privacyConsentLabel without dict.contact.privacyConsent", () => {
    assert.match(source, /legal\.privacyConsentLabel/);
    assert.doesNotMatch(source, /dict\.contact\.privacyConsent/);
  });

  it("keeps localized privacy href and privacyLink label", () => {
    assert.match(source, /localizeSiteHref\(\s*legal\.privacyNoticeUrl/);
    assert.match(source, /dict\.contact\.privacyLink/);
  });

  it("stays a server component without submit handler for hidden/preview", () => {
    assert.doesNotMatch(source, /^["']use client["']/m);
    assert.doesNotMatch(source, /FormEvent/);
    assert.doesNotMatch(source, /onSubmit/);
    assert.doesNotMatch(source, /preventDefault/);
  });

  it("keeps preview controls disabled", () => {
    assert.match(source, /formMode === "hidden"/);
    assert.match(source, /executive-consult--preview/);
    for (const control of [
      'name="name"',
      'name="phone"',
      'name="email"',
      'name="message"',
      'name="privacyAccepted"',
      'type="submit"',
    ]) {
      const start = source.indexOf(control);
      assert.ok(start >= 0, `missing control ${control}`);
      const block = source.slice(start);
      const end = block.indexOf(">");
      assert.ok(end >= 0, `unclosed control ${control}`);
      assert.match(
        block.slice(0, end + 1),
        /\bdisabled\b/,
        `falta disabled en ${control}`,
      );
    }
  });
});
