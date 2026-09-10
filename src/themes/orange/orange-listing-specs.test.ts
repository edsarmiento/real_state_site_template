import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { orangeVisibleSpecs } from "./orange-listing-specs.ts";

function listing(
  overrides: Partial<{
    property_type: string;
    bedrooms: number | null;
    bathrooms: string | null;
    built_area: string | null;
    land_area: string | null;
  }> = {},
) {
  return {
    property_type: "house",
    bedrooms: 3,
    bathrooms: "2",
    built_area: "120",
    land_area: "200",
    ...overrides,
  };
}

function keys(specs: ReturnType<typeof orangeVisibleSpecs>) {
  return specs.map((spec) => spec.key);
}

function values(specs: ReturnType<typeof orangeVisibleSpecs>) {
  return specs.map((spec) => spec.value);
}

describe("orangeVisibleSpecs", () => {
  it("includes all present specs in bedrooms, bathrooms, land, built order", () => {
    const specs = orangeVisibleSpecs(listing());
    assert.deepEqual(keys(specs), ["bedrooms", "bathrooms", "land", "built"]);
    assert.deepEqual(values(specs), ["3", "2", "200 m²", "120 m²"]);
  });

  it("omits missing bedrooms", () => {
    assert.deepEqual(keys(orangeVisibleSpecs(listing({ bedrooms: null }))), [
      "bathrooms",
      "land",
      "built",
    ]);
  });

  it("omits missing bathrooms", () => {
    assert.deepEqual(keys(orangeVisibleSpecs(listing({ bathrooms: null }))), [
      "bedrooms",
      "land",
      "built",
    ]);
  });

  it("omits blank bathrooms", () => {
    assert.deepEqual(keys(orangeVisibleSpecs(listing({ bathrooms: "  " }))), [
      "bedrooms",
      "land",
      "built",
    ]);
  });

  it("omits zero, undefined, and null bathroom strings", () => {
    for (const bathrooms of ["0", "0.0", "undefined", "null"] as const) {
      assert.deepEqual(
        keys(orangeVisibleSpecs(listing({ bathrooms }))),
        ["bedrooms", "land", "built"],
        bathrooms,
      );
    }
  });

  it("omits missing land", () => {
    const specs = orangeVisibleSpecs(listing({ land_area: null }));
    assert.deepEqual(keys(specs), ["bedrooms", "bathrooms", "built"]);
    assert.deepEqual(values(specs), ["3", "2", "120 m²"]);
  });

  it("omits missing built area", () => {
    const specs = orangeVisibleSpecs(listing({ built_area: null }));
    assert.deepEqual(keys(specs), ["bedrooms", "bathrooms", "land"]);
    assert.deepEqual(values(specs), ["3", "2", "200 m²"]);
  });

  it("keeps bedrooms at zero and omits zero land and built areas", () => {
    const specs = orangeVisibleSpecs(
      listing({ bedrooms: 0, land_area: "0", built_area: "0" }),
    );
    assert.deepEqual(keys(specs), ["bedrooms", "bathrooms"]);
    assert.deepEqual(values(specs), ["0", "2"]);
  });

  it("omits invalid land and built values", () => {
    const specs = orangeVisibleSpecs(
      listing({ land_area: "undefined", built_area: "null" }),
    );
    assert.deepEqual(keys(specs), ["bedrooms", "bathrooms"]);
  });

  it("omits empty land and built strings", () => {
    const specs = orangeVisibleSpecs(listing({ land_area: "", built_area: "   " }));
    assert.deepEqual(keys(specs), ["bedrooms", "bathrooms"]);
  });

  it("appends m² units to land and built values", () => {
    const specs = orangeVisibleSpecs(listing());
    assert.equal(specs.find((spec) => spec.key === "land")?.value, "200 m²");
    assert.equal(specs.find((spec) => spec.key === "built")?.value, "120 m²");
  });

  it("does not invent bedrooms or bathrooms for land listings", () => {
    const specs = orangeVisibleSpecs(
      listing({
        property_type: "land",
        bedrooms: 4,
        bathrooms: "3",
        land_area: "500",
        built_area: "10",
      }),
    );
    assert.deepEqual(keys(specs), ["land"]);
    assert.deepEqual(values(specs), ["500 m²"]);
  });

  it("uses built area as land when a land listing has no land_area", () => {
    const specs = orangeVisibleSpecs(
      listing({
        property_type: "land",
        bedrooms: 2,
        bathrooms: "1",
        land_area: null,
        built_area: "800",
      }),
    );
    assert.deepEqual(keys(specs), ["land"]);
    assert.deepEqual(values(specs), ["800 m²"]);
  });
});
