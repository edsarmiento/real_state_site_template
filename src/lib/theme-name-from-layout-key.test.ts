import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { themeNameFromLayoutKey } from "../themes/theme-name-from-layout-key.ts";

describe("themeNameFromLayoutKey", () => {
  it("maps default to default", () => {
    assert.equal(themeNameFromLayoutKey("default"), "default");
    assert.equal(themeNameFromLayoutKey("Default"), "default");
  });

  it("maps deo to luxury", () => {
    assert.equal(themeNameFromLayoutKey("deo"), "luxury");
    assert.equal(themeNameFromLayoutKey("DEO"), "luxury");
  });

  it("maps luxury to luxury", () => {
    assert.equal(themeNameFromLayoutKey("luxury"), "luxury");
  });

  it("maps orange to orange", () => {
    assert.equal(themeNameFromLayoutKey("orange"), "orange");
    assert.equal(themeNameFromLayoutKey("Orange"), "orange");
  });

  it("maps beige to beige", () => {
    assert.equal(themeNameFromLayoutKey("beige"), "beige");
  });

  it("maps elegant to elegant", () => {
    assert.equal(themeNameFromLayoutKey("elegant"), "elegant");
  });

  it("maps unknown keys to default, never orange", () => {
    assert.equal(themeNameFromLayoutKey("unknown"), "default");
    assert.equal(themeNameFromLayoutKey("folio"), "default");
    assert.equal(themeNameFromLayoutKey(""), "default");
  });
});
