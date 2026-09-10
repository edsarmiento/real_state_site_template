import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAbsentSpecValue } from "./listing-spec-value.ts";

describe("isAbsentSpecValue", () => {
  it("treats blank, undefined, null, and zero as absent", () => {
    for (const value of ["", "  ", "undefined", "null", "0", "0.0", "0,0"]) {
      assert.equal(isAbsentSpecValue(value), true, value);
    }
  });

  it("keeps positive bathroom and area values", () => {
    for (const value of ["1", "2.5", "1.5", "120", "200.5"]) {
      assert.equal(isAbsentSpecValue(value), false, value);
    }
  });
});
