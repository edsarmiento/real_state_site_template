import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { themeNameFromLayoutKey } from "./theme-definitions.ts";

describe("themeNameFromLayoutKey", () => {
  it("maps ultra and keeps existing themes", () => {
    assert.equal(themeNameFromLayoutKey("ultra"), "ultra");
    assert.equal(themeNameFromLayoutKey("beige"), "beige");
    assert.equal(themeNameFromLayoutKey("deo"), "luxury");
    assert.equal(themeNameFromLayoutKey("luxury"), "luxury");
    assert.equal(themeNameFromLayoutKey("default"), "default");
  });

  it("falls back to default for unknown keys", () => {
    assert.equal(themeNameFromLayoutKey("unknown"), "default");
    assert.equal(themeNameFromLayoutKey("orange"), "default");
  });
});
