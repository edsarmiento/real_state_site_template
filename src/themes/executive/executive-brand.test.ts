import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  executiveBrandInitial,
  formatExecutivePriceParts,
  resolveExecutiveCurrency,
} from "./executive-brand.ts";

describe("executiveBrandInitial", () => {
  it("uses the first letter of the brand name", () => {
    assert.equal(executiveBrandInitial("Evenia Residencial"), "E");
  });

  it("skips punctuation and whitespace", () => {
    assert.equal(executiveBrandInitial("  'agencia"), "A");
  });

  it("returns a middle dot when the name has no letters", () => {
    assert.equal(executiveBrandInitial("   "), "·");
  });
});

describe("resolveExecutiveCurrency", () => {
  it("keeps a valid ISO code and falls back to MXN", () => {
    assert.equal(resolveExecutiveCurrency("usd"), "USD");
    assert.equal(resolveExecutiveCurrency("peso"), "MXN");
    assert.equal(resolveExecutiveCurrency(null), "MXN");
  });
});

describe("formatExecutivePriceParts", () => {
  it("formats cents without inventing decimals", () => {
    assert.deepEqual(formatExecutivePriceParts(246500000, "MXN", "es"), {
      amount: "$2,465,000",
      currency: "MXN",
    });
  });
});
