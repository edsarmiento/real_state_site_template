import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { themeNameFromLayoutKey } from "./theme-definitions.ts";

describe("themeNameFromLayoutKey", () => {
  it("maps executive and keeps existing themes", () => {
    assert.equal(themeNameFromLayoutKey("executive"), "executive");
    assert.equal(themeNameFromLayoutKey("Executive"), "executive");
    assert.equal(themeNameFromLayoutKey("ultra"), "ultra");
    assert.equal(themeNameFromLayoutKey("orange"), "orange");
    assert.equal(themeNameFromLayoutKey("elegant"), "elegant");
    assert.equal(themeNameFromLayoutKey("beige"), "beige");
    assert.equal(themeNameFromLayoutKey("deo"), "luxury");
    assert.equal(themeNameFromLayoutKey("luxury"), "luxury");
    assert.equal(themeNameFromLayoutKey("default"), "default");
    assert.equal(themeNameFromLayoutKey("orange"), "orange");
    assert.equal(themeNameFromLayoutKey("yellow"), "yellow");
    assert.equal(themeNameFromLayoutKey("dark"), "dark");
  });

  it("falls back to default for unknown keys", () => {
    assert.equal(themeNameFromLayoutKey("unknown"), "default");
    assert.equal(themeNameFromLayoutKey("folio"), "default");
    assert.equal(themeNameFromLayoutKey("unknown-theme"), "default");
  });
});
