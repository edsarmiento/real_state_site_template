import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  elegantBrandInitials,
  formatElegantPriceParts,
  resolveElegantCurrency,
} from "./elegant-brand.ts";

describe("elegantBrandInitials", () => {
  it("uses the first letters of two words", () => {
    assert.equal(elegantBrandInitials("Deo Real Estate"), "DR");
  });

  it("uses the first two letters of a single word", () => {
    assert.equal(elegantBrandInitials("Inmobiliaria"), "IN");
  });
});

describe("formatElegantPriceParts", () => {
  it("formats cents without inventing a currency", () => {
    assert.deepEqual(formatElegantPriceParts(246500000, "MXN", "es"), {
      amount: "$2,465,000",
      currency: "MXN",
    });
  });

  it("falls back to MXN when the code is missing", () => {
    assert.equal(resolveElegantCurrency("peso"), "MXN");
  });
});
