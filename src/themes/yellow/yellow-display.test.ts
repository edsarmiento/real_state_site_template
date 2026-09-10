import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { brandInitial } from "./yellow-display.ts";

describe("brandInitial", () => {
  it("returns the first letter in uppercase", () => {
    assert.equal(brandInitial("casa"), "C");
    assert.equal(brandInitial("  casa"), "C");
  });

  it("returns an empty string for blank names", () => {
    assert.equal(brandInitial(""), "");
    assert.equal(brandInitial("   "), "");
  });

  it("keeps a supplementary Unicode code point intact", () => {
    assert.equal(brandInitial("\u{1F3E0} Casa"), "\u{1F3E0}");
  });
});
