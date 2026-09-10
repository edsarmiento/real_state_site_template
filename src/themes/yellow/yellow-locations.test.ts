import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  yellowCitiesMatch,
  yellowCityKey,
  yellowEditorialIndex,
  yellowLocationGridClass,
  yellowLocationSlot,
  yellowRepresentativeListingPhoto,
  yellowUniqueCities,
} from "./yellow-locations.ts";
import { localizedHref } from "../../lib/site-i18n.ts";

describe("yellowCityKey", () => {
  it("normalizes case, accents and the first comma segment", () => {
    assert.equal(yellowCityKey("  Tijuana, Baja California "), "tijuana");
    assert.equal(yellowCityKey("México"), "mexico");
  });
});

describe("yellowCitiesMatch", () => {
  it("matches exact city keys only", () => {
    assert.equal(yellowCitiesMatch("Tijuana, BC", "tijuana"), true);
    assert.equal(yellowCitiesMatch("Santa Fe", "Tijuana"), false);
    assert.equal(yellowCitiesMatch("", "Tijuana"), false);
  });

  it("does not treat a shorter token as a match (York vs New York)", () => {
    assert.equal(yellowCitiesMatch("York", "New York"), false);
    assert.equal(yellowCitiesMatch("New York", "York"), false);
    assert.equal(yellowCitiesMatch("Santa", "Santa Fe"), false);
  });
});

describe("yellowRepresentativeListingPhoto", () => {
  it("returns the first photo for an exact city match", () => {
    const listings = [
      { city: "Otra", photo_url: "https://cdn.example/other.jpg" },
      { city: "Tijuana, BC", photo_url: "https://cdn.example/tj.jpg" },
    ];
    assert.equal(
      yellowRepresentativeListingPhoto("Tijuana", listings),
      "https://cdn.example/tj.jpg",
    );
  });

  it("does not reuse another city's photograph", () => {
    assert.equal(
      yellowRepresentativeListingPhoto("York", [
        { city: "New York", photo_url: "https://cdn.example/nyc.jpg" },
      ]),
      null,
    );
  });

  it("returns null when listings are missing or have no cover", () => {
    assert.equal(yellowRepresentativeListingPhoto("Tijuana", []), null);
    assert.equal(yellowRepresentativeListingPhoto("Tijuana", null), null);
    assert.equal(
      yellowRepresentativeListingPhoto("Tijuana", [
        { city: "Tijuana", photo_url: "  " },
      ]),
      null,
    );
  });
});

describe("yellowUniqueCities", () => {
  it("dedupes by city key and can prepend the active filter", () => {
    assert.deepEqual(
      yellowUniqueCities(
        [
          { city: "Tijuana, BC", photo_url: null },
          { city: "tijuana", photo_url: null },
          { city: "Santa Fe", photo_url: null },
        ],
        "Ensenada",
      ),
      ["Ensenada", "Tijuana, BC", "Santa Fe"],
    );
  });

  it("treats a non-array catalog payload as empty", () => {
    assert.deepEqual(yellowUniqueCities(null), []);
    assert.deepEqual(yellowUniqueCities(undefined), []);
  });
});

describe("yellowLocation layout", () => {
  it("uses a featured slot for 0–1 destinations", () => {
    assert.equal(yellowLocationSlot(0, 0), "featured");
    assert.equal(yellowLocationSlot(0, 1), "featured");
    assert.equal(
      yellowLocationGridClass(1),
      "yellow-locations__grid yellow-locations__grid--single",
    );
  });

  it("pairs two destinations as featured + stack", () => {
    assert.equal(yellowLocationSlot(0, 2), "featured");
    assert.equal(yellowLocationSlot(1, 2), "stack");
    assert.ok(yellowLocationGridClass(2).includes("--pair"));
  });

  it("uses a stable featured/stack/stack/wide pattern for several cities", () => {
    assert.deepEqual(
      [0, 1, 2, 3, 4].map((index) => yellowLocationSlot(index, 5)),
      ["featured", "stack", "stack", "wide", "featured"],
    );
    assert.ok(yellowLocationGridClass(5).includes("--bento"));
    assert.equal(yellowEditorialIndex(0), "01");
    assert.equal(yellowEditorialIndex(2), "03");
  });
});

describe("Yellow location catalog URLs", () => {
  it("keeps the city filter and ends at the catalog hash", () => {
    const href = localizedHref("/#catalogo", "es", { city: "Tijuana" }, "es");
    assert.equal(href, "/?city=Tijuana#catalogo");
  });

  it("keeps lang when it differs from the default locale", () => {
    const href = localizedHref("/#catalogo", "en", { city: "Tijuana" }, "es");
    assert.equal(href.startsWith("/?"), true);
    assert.equal(href.endsWith("#catalogo"), true);
    assert.equal(href.includes("city=Tijuana"), true);
    assert.equal(href.includes("lang=en"), true);
    assert.equal(href.includes("#catalogo#"), false);
  });

  it("encodes city characters and does not put the hash before the query", () => {
    const href = localizedHref("/#catalogo", "es", { city: "Santa Fe" }, "es");
    assert.equal(href, "/?city=Santa+Fe#catalogo");
  });
});
