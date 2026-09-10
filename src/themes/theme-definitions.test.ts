import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  themeNameFromLayoutKey,
  normalizeLayoutKey,
} from "./theme-definitions.ts";

describe("themeNameFromLayoutKey", () => {
  it("selects elegant for layout_key elegant", () => {
    assert.equal(themeNameFromLayoutKey("elegant"), "elegant");
    assert.equal(themeNameFromLayoutKey("Elegant"), "elegant");
  });

  it("keeps existing layout keys on their themes", () => {
    assert.equal(themeNameFromLayoutKey("default"), "default");
    assert.equal(themeNameFromLayoutKey("beige"), "beige");
    assert.equal(themeNameFromLayoutKey("deo"), "luxury");
    assert.equal(themeNameFromLayoutKey("luxury"), "luxury");
    assert.equal(themeNameFromLayoutKey("orange"), "orange");
  });

  it("falls back to default for unknown keys", () => {
    assert.equal(themeNameFromLayoutKey("ultra"), "default");
    assert.equal(themeNameFromLayoutKey(""), "default");
  });
});

describe("normalizeLayoutKey", () => {
  it("persists elegant when the stored key is elegant", () => {
    assert.equal(normalizeLayoutKey("elegant"), "elegant");
  });

  it("does not coerce unknown keys to elegant", () => {
    assert.equal(normalizeLayoutKey("nope"), "default");
    assert.equal(normalizeLayoutKey(undefined), "default");
  });
});
