import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampGalleryIndex,
  galleryIndexAfterKeyClamped,
  listingGalleryCanGoNext,
  listingGalleryCanGoPrev,
  listingGallerySlideWidthPx,
  LISTING_GALLERY_STRIP_FALLBACK_RATIO,
  listingGalleryStripChrome,
} from "./listing-gallery-strip.ts";
import { listingGalleryPhotoUrls } from "./listing-gallery-urls.ts";
import {
  galleryIndexAfterKey,
  wrapGalleryIndex,
} from "./listing-gallery-nav.ts";

describe("listingGalleryPhotoUrls", () => {
  it("orders photos, removes signed duplicates, and leaves the input unchanged", () => {
    const photos = [
      { id: 1, url: "https://cdn.example/b.jpg?signature=one", position: 2 },
      { id: 2, url: " https://cdn.example/a.jpg ", position: 0 },
      { id: 3, url: "https://cdn.example/b.jpg?signature=two", position: 1 },
    ];
    assert.deepEqual(listingGalleryPhotoUrls(photos, "https://cover.jpg"), ["https://cdn.example/a.jpg", "https://cdn.example/b.jpg?signature=two"]);
    assert.deepEqual(photos.map((p) => p.position), [2, 0, 1]);
  });
  it("prefers photo urls and falls back to cover", () => {
    assert.deepEqual(
      listingGalleryPhotoUrls(
        [
          { id: 1, url: " https://a/1.jpg ", position: 0 },
          { id: 2, url: null, position: 1 },
        ],
        "https://cover.jpg",
      ),
      ["https://a/1.jpg"],
    );
    assert.deepEqual(
      listingGalleryPhotoUrls([], " https://cover.jpg "),
      ["https://cover.jpg"],
    );
    assert.deepEqual(listingGalleryPhotoUrls([], null), []);
  });
});

describe("carousel navigation (default)", () => {
  it("wraps at the ends", () => {
    assert.equal(wrapGalleryIndex(3, 3), 0);
    assert.equal(wrapGalleryIndex(-1, 3), 2);
    assert.equal(galleryIndexAfterKey("ArrowLeft", 0, 3), 2);
    assert.equal(galleryIndexAfterKey("ArrowRight", 2, 3), 0);
  });
});

describe("strip navigation (clamp, no wrap)", () => {
  it("clamps indices and blocks ends", () => {
    assert.equal(clampGalleryIndex(-1, 3), 0);
    assert.equal(clampGalleryIndex(9, 3), 2);
    assert.equal(listingGalleryCanGoPrev(0), false);
    assert.equal(listingGalleryCanGoNext(2, 3), false);
    assert.equal(galleryIndexAfterKeyClamped("ArrowLeft", 0, 3), null);
    assert.equal(galleryIndexAfterKeyClamped("ArrowRight", 2, 3), null);
    assert.equal(galleryIndexAfterKeyClamped("ArrowRight", 0, 3), 1);
  });

  it("computes slide width from ratio", () => {
    assert.equal(listingGallerySlideWidthPx(400, 0.75), 300);
    assert.equal(
      listingGallerySlideWidthPx(400, 0),
      400 * LISTING_GALLERY_STRIP_FALLBACK_RATIO,
    );
  });

  it("localizes strip chrome", () => {
    assert.equal(listingGalleryStripChrome("es").viewAll, "Ver todas las fotos");
    assert.equal(listingGalleryStripChrome("en").viewAll, "View all photos");
  });
});
