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

  it("selects ultra for layout_key ultra", () => {
    assert.equal(themeNameFromLayoutKey("ultra"), "ultra");
    assert.equal(themeNameFromLayoutKey("Ultra"), "ultra");
  });

  it("selects yellow for layout_key yellow", () => {
    assert.equal(themeNameFromLayoutKey("yellow"), "yellow");
    assert.equal(themeNameFromLayoutKey("Yellow"), "yellow");
  });

  it("selects executive for layout_key executive", () => {
    assert.equal(themeNameFromLayoutKey("executive"), "executive");
    assert.equal(themeNameFromLayoutKey("Executive"), "executive");
  });

  it("keeps existing layout keys on their themes", () => {
    assert.equal(themeNameFromLayoutKey("default"), "default");
    assert.equal(themeNameFromLayoutKey("beige"), "beige");
    assert.equal(themeNameFromLayoutKey("deo"), "luxury");
    assert.equal(themeNameFromLayoutKey("luxury"), "luxury");
    assert.equal(themeNameFromLayoutKey("elegant"), "elegant");
    assert.equal(themeNameFromLayoutKey("orange"), "orange");
    assert.equal(themeNameFromLayoutKey("ultra"), "ultra");
    assert.equal(themeNameFromLayoutKey("yellow"), "yellow");
    assert.equal(themeNameFromLayoutKey("executive"), "executive");
  });

  it("falls back to default for unknown keys", () => {
    assert.equal(themeNameFromLayoutKey("unknown-theme"), "default");
    assert.equal(themeNameFromLayoutKey("nonexistent"), "default");
    assert.equal(themeNameFromLayoutKey(""), "default");
  });
});

describe("normalizeLayoutKey", () => {
  it("persists elegant when the stored key is elegant", () => {
    assert.equal(normalizeLayoutKey("elegant"), "elegant");
  });

  it("persists ultra when the stored key is ultra", () => {
    assert.equal(normalizeLayoutKey("ultra"), "ultra");
  });

  it("persists yellow when the stored key is yellow", () => {
    assert.equal(normalizeLayoutKey("yellow"), "yellow");
  });

  it("persists executive when the stored key is executive", () => {
    assert.equal(normalizeLayoutKey("executive"), "executive");
  });

  it("does not coerce unknown keys to elegant", () => {
    assert.equal(normalizeLayoutKey("nope"), "default");
    assert.equal(normalizeLayoutKey(undefined), "default");
  });
});
