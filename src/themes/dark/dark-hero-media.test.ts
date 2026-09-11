import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveDarkHeroImage } from "./dark-hero-media.ts";

describe("resolveDarkHeroImage", () => {
  it("returns null when there are no images", () => {
    assert.equal(resolveDarkHeroImage({}), null);
    assert.equal(
      resolveDarkHeroImage({
        configuredUrl: "  ",
        galleryUrls: ["", "   "],
        listingPhotoUrl: null,
      }),
      null,
    );
  });

  it("prefers the configured image over gallery and listing photos", () => {
    assert.equal(
      resolveDarkHeroImage({
        configuredUrl: "https://cdn.example/hero.jpg",
        galleryUrls: ["https://cdn.example/a.jpg"],
        listingPhotoUrl: "https://cdn.example/b.jpg",
      }),
      "https://cdn.example/hero.jpg",
    );
  });

  it("uses the first gallery URL when no configured image exists", () => {
    assert.equal(
      resolveDarkHeroImage({
        galleryUrls: ["  ", "https://cdn.example/a.jpg"],
        listingPhotoUrl: "https://cdn.example/b.jpg",
      }),
      "https://cdn.example/a.jpg",
    );
  });

  it("falls back to a listing photo", () => {
    assert.equal(
      resolveDarkHeroImage({
        listingPhotoUrl: " https://cdn.example/b.jpg ",
      }),
      "https://cdn.example/b.jpg",
    );
  });
});
