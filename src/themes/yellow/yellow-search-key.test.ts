import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { yellowSearchRemountKey } from "./yellow-search-key.ts";

describe("yellowSearchRemountKey", () => {
  it("is stable for the same normalized filter tuple", () => {
    assert.equal(
      yellowSearchRemountKey({
        city: "Tijuana",
        propertyType: "house",
        bedrooms: "2",
      }),
      yellowSearchRemountKey({
        city: "Tijuana",
        propertyType: "house",
        bedrooms: "2",
      }),
    );
  });

  it("does not collide when a value contains the former separator", () => {
    const left = yellowSearchRemountKey({
      city: "a|b",
      propertyType: "c",
      bedrooms: "1",
    });
    const right = yellowSearchRemountKey({
      city: "a",
      propertyType: "b|c",
      bedrooms: "1",
    });
    assert.notEqual(left, right);
  });

  it("changes when a filter changes", () => {
    assert.notEqual(
      yellowSearchRemountKey({
        city: "Tijuana",
        propertyType: "",
        bedrooms: "",
      }),
      yellowSearchRemountKey({
        city: "",
        propertyType: "",
        bedrooms: "",
      }),
    );
  });
});
