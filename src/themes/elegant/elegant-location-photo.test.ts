import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cityKey,
  elegantLocationsGridClass,
  listingMatchesLocation,
  representativeListingPhoto,
} from "./elegant-location-photo.ts";

describe("cityKey", () => {
  it("does not treat York as New York", () => {
    assert.notEqual(cityKey("York"), cityKey("New York"));
  });
});

describe("listingMatchesLocation", () => {
  it("prefers city over location_label", () => {
    assert.equal(
      listingMatchesLocation(
        { city: "Tijuana", location_label: "Santa Fe, Tijuana" },
        "Santa Fe",
      ),
      false,
    );
    assert.equal(
      listingMatchesLocation(
        { city: "Tijuana", location_label: "Santa Fe, Tijuana" },
        "Tijuana",
      ),
      true,
    );
  });

  it("uses location_label only when city is empty", () => {
    assert.equal(
      listingMatchesLocation(
        { city: "", location_label: "Santa Fe, Tijuana" },
        "Santa Fe",
      ),
      true,
    );
  });
});

describe("representativeListingPhoto", () => {
  it("returns the first matching listing photo", () => {
    assert.equal(
      representativeListingPhoto("Tijuana", [
        { city: "York", photo_url: "https://cdn.example/york.jpg" },
        { city: "Tijuana", photo_url: "https://cdn.example/tij.jpg" },
      ]),
      "https://cdn.example/tij.jpg",
    );
  });

  it("returns null when nothing matches", () => {
    assert.equal(
      representativeListingPhoto("Tijuana", [
        { city: "York", photo_url: "https://cdn.example/york.jpg" },
      ]),
      null,
    );
  });
});

describe("elegantLocationsGridClass", () => {
  it("uses a single-column modifier when there is one destination", () => {
    assert.equal(
      elegantLocationsGridClass(1),
      "elegant-locations__grid elegant-locations__grid--single",
    );
  });

  it("drops the single modifier when there are several destinations", () => {
    assert.equal(elegantLocationsGridClass(2), "elegant-locations__grid");
    assert.equal(elegantLocationsGridClass(4), "elegant-locations__grid");
  });
});
