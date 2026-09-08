import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  listingPhotoUrls,
  needsUnfilteredHeroCatalog,
  resolveHeroPhotoUrls,
} from "./ultra-hero-media.ts";

describe("listingPhotoUrls", () => {
  it("keeps unique covers in listing order", () => {
    assert.deepEqual(
      listingPhotoUrls(
        [
          { photo_url: " https://cdn/a.jpg " },
          { photo_url: null },
          { photo_url: "https://cdn/a.jpg" },
          { photo_url: "https://cdn/d.jpg" },
        ],
        3,
      ),
      ["https://cdn/a.jpg", "https://cdn/d.jpg"],
    );
  });
});

describe("resolveHeroPhotoUrls", () => {
  it("prefers the configured SiteConfig image", () => {
    assert.deepEqual(
      resolveHeroPhotoUrls({
        configuredUrl: "https://cdn/hero.jpg",
        galleryUrls: ["https://cdn/filtered.jpg"],
        listings: [{ photo_url: "https://cdn/card.jpg" }],
      }),
      [
        "https://cdn/hero.jpg",
        "https://cdn/filtered.jpg",
        "https://cdn/card.jpg",
      ],
    );
  });

  it("falls through to catalog covers when earlier sources are empty", () => {
    assert.deepEqual(
      resolveHeroPhotoUrls({
        configuredUrl: "  ",
        galleryUrls: [],
        listings: [{ photo_url: null }],
        catalogUrls: ["https://cdn/general.jpg"],
      }),
      ["https://cdn/general.jpg"],
    );
  });
});

describe("needsUnfilteredHeroCatalog", () => {
  it("requests a catalog fallback only for a successful filtered empty photo set", () => {
    assert.equal(
      needsUnfilteredHeroCatalog({
        hasAnyFilter: true,
        catalogOk: true,
        resolvedCount: 0,
      }),
      true,
    );
    assert.equal(
      needsUnfilteredHeroCatalog({
        hasAnyFilter: false,
        catalogOk: true,
        resolvedCount: 0,
      }),
      false,
    );
    assert.equal(
      needsUnfilteredHeroCatalog({
        hasAnyFilter: true,
        catalogOk: true,
        resolvedCount: 1,
      }),
      false,
    );
  });
});
