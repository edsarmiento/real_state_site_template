import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listingPublicPath } from "../../lib/listing-public-path";
import type { PublicListingCard } from "../../lib/listing-types";
import {
  resolveYellowHeroUrls,
  yellowHeroFrameCount,
  yellowSafeListingArray,
} from "./yellow-hero-urls";

const validCard: PublicListingCard = {
  slug: "casa-centro",
  title: "Casa en el centro",
  rent_cents: 1_500_000,
  currency: "MXN",
  offer_type: "rent",
  city: "Tijuana",
  state_or_region: "BC",
  colony: null,
  location_label: "Centro, Tijuana",
  property_type: "house",
  bedrooms: 3,
  bathrooms: "2",
  built_area: "120",
  land_area: null,
  photo_url: "https://cdn.example/a.jpg",
  agency_name: "Agencia",
  agency_logo_url: null,
};

function withoutKey(
  card: PublicListingCard,
  key: keyof PublicListingCard,
): Record<string, unknown> {
  const copy: Record<string, unknown> = { ...card };
  delete copy[key];
  return copy;
}

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
  it("treats undefined, null, non-arrays and empty arrays as empty", () => {
    assert.deepEqual(yellowSafeListingArray(undefined), []);
    assert.deepEqual(yellowSafeListingArray(null), []);
    assert.deepEqual(yellowSafeListingArray({ listings: [] }), []);
    assert.deepEqual(yellowSafeListingArray("listings"), []);
    assert.deepEqual(yellowSafeListingArray([]), []);
  });

  it("drops empty objects, photo-only payloads and nested arrays", () => {
    assert.deepEqual(yellowSafeListingArray([{}]), []);
    assert.deepEqual(
      yellowSafeListingArray([{ photo_url: "https://cdn.example/a.jpg" }]),
      [],
    );
    assert.deepEqual(yellowSafeListingArray([[validCard]]), []);
  });

  it("rejects a missing required field one by one", () => {
    const required: (keyof PublicListingCard)[] = [
      "slug",
      "title",
      "rent_cents",
      "currency",
      "offer_type",
      "city",
      "state_or_region",
      "colony",
      "location_label",
      "property_type",
      "bedrooms",
      "bathrooms",
      "built_area",
      "land_area",
      "photo_url",
      "agency_name",
      "agency_logo_url",
    ];
    for (const key of required) {
      assert.deepEqual(
        yellowSafeListingArray([withoutKey(validCard, key)]),
        [],
        `expected rejection when ${key} is missing`,
      );
    }
  });

  it("rejects a required field with the wrong type", () => {
    assert.deepEqual(
      yellowSafeListingArray([{ ...validCard, slug: 12 }]),
      [],
    );
    assert.deepEqual(
      yellowSafeListingArray([{ ...validCard, rent_cents: "1500000" }]),
      [],
    );
    assert.deepEqual(
      yellowSafeListingArray([{ ...validCard, offer_type: "todas" }]),
      [],
    );
    assert.deepEqual(
      yellowSafeListingArray([{ ...validCard, bedrooms: "3" }]),
      [],
    );
  });

  it("keeps a valid card when optional coordinates are absent", () => {
    assert.deepEqual(yellowSafeListingArray([validCard]), [validCard]);
  });

  it("keeps valid records in their original order and drops invalid neighbors", () => {
    const second: PublicListingCard = {
      ...validCard,
      slug: "depto-playas",
      title: "Departamento",
      photo_url: null,
    };
    const kept = yellowSafeListingArray([
      null,
      { photo_url: "https://cdn.example/a.jpg" },
      validCard,
      { ...validCard, slug: "  " },
      second,
    ]);
    assert.deepEqual(kept, [validCard, second]);
    assert.deepEqual(
      kept.map((card) => listingPublicPath(card.slug)),
      ["/inmueble/casa-centro", "/inmueble/depto-playas"],
    );
  });

  it("never produces /inmueble/undefined from accepted cards", () => {
    const kept = yellowSafeListingArray([
      { photo_url: "https://cdn.example/a.jpg" },
      validCard,
      withoutKey(validCard, "slug"),
    ]);
    for (const card of kept) {
      const href = listingPublicPath(card.slug);
      assert.equal(href.includes("undefined"), false);
      assert.equal(href.startsWith("/inmueble/"), true);
    }
  });
});
