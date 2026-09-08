import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isMxLocalPhone, onlyPhoneDigits } from "./phone.ts";

describe("isMxLocalPhone", () => {
  it("accepts exactly 10 digits", () => {
    assert.equal(isMxLocalPhone("6641234567"), true);
  });

  it("rejects short, long, or formatted values", () => {
    assert.equal(isMxLocalPhone("664123456"), false);
    assert.equal(isMxLocalPhone("66412345670"), false);
    assert.equal(isMxLocalPhone("664-123-4567"), false);
    assert.equal(isMxLocalPhone(""), false);
  });
});

describe("onlyPhoneDigits", () => {
  it("keeps the first 10 digits from a formatted number", () => {
    assert.equal(onlyPhoneDigits("664-123-4567"), "6641234567");
  });
});
