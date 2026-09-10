import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cityKey,
  listingMatchesLocation,
  representativeListingPhoto,
} from "../../lib/listing-location-photo.ts";

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


describe("location photo edge cases", () => {
  it("normalizes accents, whitespace and regional suffixes", () => {
    assert.equal(cityKey("  MÉRIDA, Yucatán "), "merida");
  });

  it("skips blank photos and preserves the first valid match", () => {
    assert.equal(representativeListingPhoto("Mérida", [
      { city: "Merida", photo_url: "  " },
      { city: "", location_label: "Mérida, Yucatán", photo_url: " photo.jpg " },
      { city: "Merida", photo_url: "later.jpg" },
    ]), "photo.jpg");
  });

  it("returns null without a city or a usable photo", () => {
    assert.equal(representativeListingPhoto(undefined, [{ photo_url: "photo.jpg" }]), null);
    assert.equal(representativeListingPhoto(" ", [{ photo_url: "photo.jpg" }]), null);
    assert.equal(representativeListingPhoto("Merida", [{ city: "Merida", photo_url: " " }]), null);
  });
});
