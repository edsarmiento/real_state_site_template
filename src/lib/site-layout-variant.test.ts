import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isStyledSiteLayout } from "./site-layout-variant.ts";

describe("isStyledSiteLayout", () => {
  it("is false for default and unknown keys", () => {
    assert.equal(isStyledSiteLayout("default"), false);
    assert.equal(isStyledSiteLayout("unknown"), false);
    assert.equal(isStyledSiteLayout("folio"), false);
    assert.equal(isStyledSiteLayout(""), false);
  });

  it("is true for registered non-default themes", () => {
    assert.equal(isStyledSiteLayout("dark"), true);
    assert.equal(isStyledSiteLayout("yellow"), true);
    assert.equal(isStyledSiteLayout("deo"), true);
    assert.equal(isStyledSiteLayout("luxury"), true);
  });
});
