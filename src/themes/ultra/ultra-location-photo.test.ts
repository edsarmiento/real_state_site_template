import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { representativeListingPhoto } from "./ultra-location-photo.ts";

describe("representativeListingPhoto", () => {
  it("does not treat New York as a match for York", () => {
    const listings = [
      {
        city: "New York",
        location_label: "New York, NY",
        photo_url: "https://cdn.example/new-york.jpg",
      },
    ];

    assert.equal(representativeListingPhoto("York", listings), null);
    assert.equal(
      representativeListingPhoto("New York", listings),
      "https://cdn.example/new-york.jpg",
    );
  });

  it("matches the city token before a comma in location_label", () => {
    const listings = [
      {
        city: "",
        location_label: "Santa Fe, Tijuana",
        photo_url: "https://cdn.example/santa-fe.jpg",
      },
    ];

    assert.equal(
      representativeListingPhoto("Santa Fe", listings),
      "https://cdn.example/santa-fe.jpg",
    );
  });
});
