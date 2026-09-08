import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  galleryIndexAfterKey,
  wrapGalleryIndex,
} from "./listing-gallery-nav.ts";

describe("wrapGalleryIndex", () => {
  it("wraps past the last photo back to the first", () => {
    assert.equal(wrapGalleryIndex(3, 3), 0);
    assert.equal(wrapGalleryIndex(-1, 3), 2);
  });

  it("stays at 0 when the gallery is empty", () => {
    assert.equal(wrapGalleryIndex(2, 0), 0);
  });
});

describe("galleryIndexAfterKey", () => {
  it("moves with arrow keys and ignores other keys", () => {
    assert.equal(galleryIndexAfterKey("ArrowRight", 0, 3), 1);
    assert.equal(galleryIndexAfterKey("ArrowLeft", 0, 3), 2);
    assert.equal(galleryIndexAfterKey("Escape", 1, 3), null);
  });

  it("does not move when there is only one photo", () => {
    assert.equal(galleryIndexAfterKey("ArrowRight", 0, 1), null);
  });
});
