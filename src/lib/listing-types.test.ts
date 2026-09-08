import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listingGalleryUrls } from "./listing-gallery.ts";

const signed = (path: string, sig: string) =>
  `https://cdn.example/uploads/${path}?X-Amz-Signature=${sig}`;

describe("listingGalleryUrls", () => {
  it("returns an empty list when there is no cover and no photos", () => {
    assert.deepEqual(listingGalleryUrls({}), []);
    assert.deepEqual(listingGalleryUrls({ photo_url: "  ", photos: [] }), []);
    assert.deepEqual(
      listingGalleryUrls({
        photo_url: null,
        photos: [{ id: 1, url: null, position: 0 }],
      }),
      [],
    );
  });

  it("keeps the cover as the first image", () => {
    assert.deepEqual(
      listingGalleryUrls({
        photo_url: signed("cover.jpg", "a"),
        photos: [
          { id: 2, url: signed("two.jpg", "b"), position: 1 },
          { id: 1, url: signed("cover.jpg", "a"), position: 0 },
          { id: 3, url: signed("three.jpg", "c"), position: 2 },
        ],
      }),
      [
        signed("cover.jpg", "a"),
        signed("two.jpg", "b"),
        signed("three.jpg", "c"),
      ],
    );
  });

  it("uses only the cover when the gallery is missing", () => {
    assert.deepEqual(listingGalleryUrls({ photo_url: signed("cover.jpg", "a") }), [
      signed("cover.jpg", "a"),
    ]);
  });

  it("works with 1, 2, or 3 gallery photos", () => {
    const cover = signed("cover.jpg", "a");
    assert.equal(
      listingGalleryUrls({
        photo_url: cover,
        photos: [{ id: 1, url: cover, position: 0 }],
      }).length,
      1,
    );
    assert.equal(
      listingGalleryUrls({
        photo_url: cover,
        photos: [
          { id: 1, url: cover, position: 0 },
          { id: 2, url: signed("two.jpg", "b"), position: 1 },
        ],
      }).length,
      2,
    );
    assert.equal(
      listingGalleryUrls({
        photo_url: cover,
        photos: [
          { id: 1, url: cover, position: 0 },
          { id: 2, url: signed("two.jpg", "b"), position: 1 },
          { id: 3, url: signed("three.jpg", "c"), position: 2 },
        ],
      }).length,
      3,
    );
  });

  it("drops empty URLs and signed duplicates of the same file", () => {
    assert.deepEqual(
      listingGalleryUrls({
        photo_url: signed("cover.jpg", "old"),
        photos: [
          { id: 1, url: signed("cover.jpg", "new"), position: 0 },
          { id: 2, url: "  ", position: 1 },
          { id: 3, url: null, position: 2 },
          { id: 4, url: signed("two.jpg", "x"), position: 3 },
        ],
      }),
      [signed("cover.jpg", "old"), signed("two.jpg", "x")],
    );
  });
});
