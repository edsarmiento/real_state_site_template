import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_LISTING_GALLERY_LABELS,
  listingGalleryLabelsForLocale,
} from "./listing-gallery-labels.ts";

describe("listingGalleryLabelsForLocale", () => {
  it("matches Spanish defaults for es", () => {
    assert.deepEqual(
      listingGalleryLabelsForLocale("es"),
      DEFAULT_LISTING_GALLERY_LABELS,
    );
  });

  it("returns English copy for en", () => {
    const labels = listingGalleryLabelsForLocale("en");
    assert.equal(labels.empty, "No photos");
    assert.equal(labels.prev, "Previous photo");
    assert.equal(labels.photoAlt, "{title} — photo {index} of {count}");
  });
});
