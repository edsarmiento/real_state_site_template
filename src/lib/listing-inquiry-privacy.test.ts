import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isPrivacyAccepted } from "./listing-inquiry-privacy.ts";

describe("isPrivacyAccepted", () => {
  it("accepts the native checkbox value", () => {
    assert.equal(isPrivacyAccepted("on"), true);
  });

  it("rejects missing or empty consent", () => {
    assert.equal(isPrivacyAccepted(null), false);
    assert.equal(isPrivacyAccepted(""), false);
    assert.equal(isPrivacyAccepted("off"), false);
  });

  it("accepts true and 1", () => {
    assert.equal(isPrivacyAccepted("true"), true);
    assert.equal(isPrivacyAccepted("1"), true);
  });
});
