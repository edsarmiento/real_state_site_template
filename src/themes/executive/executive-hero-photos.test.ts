import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  executiveHeroFrames,
  executiveHeroPhotoUrls,
} from "./executive-hero-photos.ts";

describe("executiveHeroPhotoUrls", () => {
  it("returns an empty list when nothing is available", () => {
    assert.deepEqual(
      executiveHeroPhotoUrls({
        configuredUrl: null,
        galleryUrls: null,
        listingCoverUrls: [null, "  ", undefined],
      }),
      [],
    );
  });

  it("returns an empty list when data is null or omitted", () => {
    assert.deepEqual(executiveHeroPhotoUrls(null), []);
    assert.deepEqual(executiveHeroPhotoUrls(undefined), []);
  });

  it("ignores listing covers and galleries that are not arrays", () => {
    assert.deepEqual(
      executiveHeroPhotoUrls({
        configuredUrl: null,
        galleryUrls: "https://cdn.example/not-a-list.jpg",
        listingCoverUrls: { photo_url: "https://cdn.example/cover.jpg" },
      }),
      [],
    );
  });

  it("prefers the configured image, then gallery, then listing covers", () => {
    assert.deepEqual(
      executiveHeroPhotoUrls({
        configuredUrl: " https://cdn.example/hero.jpg ",
        galleryUrls: ["https://cdn.example/g1.jpg", "https://cdn.example/g2.jpg"],
        listingCoverUrls: ["https://cdn.example/c1.jpg"],
      }),
      [
        "https://cdn.example/hero.jpg",
        "https://cdn.example/g1.jpg",
        "https://cdn.example/g2.jpg",
      ],
    );
  });

  it("deduplicates and caps at three frames", () => {
    assert.deepEqual(
      executiveHeroPhotoUrls({
        galleryUrls: [
          "https://cdn.example/a.jpg",
          "https://cdn.example/a.jpg",
          "https://cdn.example/b.jpg",
          "https://cdn.example/c.jpg",
          "https://cdn.example/d.jpg",
        ],
      }),
      [
        "https://cdn.example/a.jpg",
        "https://cdn.example/b.jpg",
        "https://cdn.example/c.jpg",
      ],
    );
  });

  it("drops empty URLs before listing covers", () => {
    assert.deepEqual(
      executiveHeroPhotoUrls({
        configuredUrl: "   ",
        galleryUrls: ["", "   ", null],
        listingCoverUrls: ["https://cdn.example/cover.jpg"],
      }),
      ["https://cdn.example/cover.jpg"],
    );
  });
});

describe("executiveHeroFrames", () => {
  const panel = { kind: "panel" } as const;

  it("uses three architectural panels when there are no photos", () => {
    assert.deepEqual(executiveHeroFrames([]), [panel, panel, panel]);
    assert.deepEqual(executiveHeroFrames(null), [panel, panel, panel]);
    assert.deepEqual(executiveHeroFrames(undefined), [panel, panel, panel]);
    assert.deepEqual(
      executiveHeroFrames("https://cdn.example/a.jpg"),
      [panel, panel, panel],
    );
  });

  it("keeps secondary slots as panels when only one photo exists", () => {
    assert.deepEqual(executiveHeroFrames(["https://cdn.example/a.jpg"]), [
      { kind: "photo", src: "https://cdn.example/a.jpg" },
      panel,
      panel,
    ]);
  });

  it("fills the third slot with a panel when two photos exist", () => {
    assert.deepEqual(
      executiveHeroFrames([
        "https://cdn.example/a.jpg",
        "https://cdn.example/b.jpg",
      ]),
      [
        { kind: "photo", src: "https://cdn.example/a.jpg" },
        { kind: "photo", src: "https://cdn.example/b.jpg" },
        panel,
      ],
    );
  });

  it("uses three unique photos and ignores the rest", () => {
    assert.deepEqual(
      executiveHeroFrames([
        "https://cdn.example/a.jpg",
        "https://cdn.example/b.jpg",
        "https://cdn.example/c.jpg",
        "https://cdn.example/d.jpg",
      ]),
      [
        { kind: "photo", src: "https://cdn.example/a.jpg" },
        { kind: "photo", src: "https://cdn.example/b.jpg" },
        { kind: "photo", src: "https://cdn.example/c.jpg" },
      ],
    );
  });

  it("does not duplicate the same URL across slots", () => {
    assert.deepEqual(
      executiveHeroFrames([
        "https://cdn.example/a.jpg",
        "https://cdn.example/a.jpg",
        "  https://cdn.example/a.jpg  ",
        "https://cdn.example/b.jpg",
      ]),
      [
        { kind: "photo", src: "https://cdn.example/a.jpg" },
        { kind: "photo", src: "https://cdn.example/b.jpg" },
        panel,
      ],
    );
  });
});
