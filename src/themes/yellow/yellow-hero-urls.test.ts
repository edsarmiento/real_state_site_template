import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  resolveYellowHeroUrls,
  yellowHeroFrameCount,
  yellowSafeListingArray,
} from "./yellow-hero-urls.ts";

describe("resolveYellowHeroUrls", () => {
  it("returns an empty list for 0 usable images", () => {
    assert.deepEqual(resolveYellowHeroUrls("  ", null, null), []);
    assert.deepEqual(resolveYellowHeroUrls(undefined, undefined, undefined), []);
    assert.equal(yellowHeroFrameCount([]), 0);
  });

  it("keeps a single unique image without fabricating extras", () => {
    assert.deepEqual(resolveYellowHeroUrls("https://cdn.example/a.jpg", [""], []), [
      "https://cdn.example/a.jpg",
    ]);
    assert.equal(yellowHeroFrameCount(["https://cdn.example/a.jpg"]), 1);
  });

  it("keeps two unique images without duplicating the first", () => {
    assert.deepEqual(
      resolveYellowHeroUrls(null, ["https://cdn.example/a.jpg", "https://cdn.example/b.jpg"], []),
      ["https://cdn.example/a.jpg", "https://cdn.example/b.jpg"],
    );
    assert.equal(yellowHeroFrameCount(["a", "b"]), 2);
  });

  it("fills remaining slots from gallery then catalog covers without duplicates", () => {
    assert.deepEqual(
      resolveYellowHeroUrls(" https://cdn.example/hero.jpg ", [
        "https://cdn.example/hero.jpg",
        "https://cdn.example/a.jpg",
      ], ["https://cdn.example/a.jpg", "https://cdn.example/b.jpg"]),
      [
        "https://cdn.example/hero.jpg",
        "https://cdn.example/a.jpg",
        "https://cdn.example/b.jpg",
      ],
    );
    assert.equal(
      yellowHeroFrameCount(["a", "b", "c", "d"]),
      3,
    );
  });

  it("ignores non-array listing and catalog data", () => {
    assert.deepEqual(
      resolveYellowHeroUrls(null, undefined, undefined),
      [],
    );
  });

  it("caps the collage at three unique frames", () => {
    assert.deepEqual(
      resolveYellowHeroUrls(null, ["1", "2", "3", "4"], ["5"]),
      ["1", "2", "3"],
    );
  });
});

describe("yellowSafeListingArray", () => {
  it("treats null catalog payloads and non-arrays as empty", () => {
    assert.deepEqual(yellowSafeListingArray(null), []);
    assert.deepEqual(yellowSafeListingArray({ listings: [] }), []);
    assert.deepEqual(yellowSafeListingArray("listings"), []);
  });

  it("keeps a real listings array", () => {
    const listings = [{ photo_url: "https://cdn.example/a.jpg" }];
    assert.equal(yellowSafeListingArray(listings), listings);
  });
});
