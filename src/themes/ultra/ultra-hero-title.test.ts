import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ultraHeroTitleParts,
  uniquePhotoUrls,
} from "./ultra-hero-title.ts";

describe("ultraHeroTitleParts", () => {
  it("returns empty parts for blank titles", () => {
    assert.deepEqual(ultraHeroTitleParts(""), { lead: "", accent: "" });
    assert.deepEqual(ultraHeroTitleParts("   "), { lead: "", accent: "" });
  });

  it("accents the whole title when there is a single word", () => {
    assert.deepEqual(ultraHeroTitleParts("Inmuebles"), {
      lead: "",
      accent: "Inmuebles",
    });
  });

  it("accents the last word of a multi-word title", () => {
    assert.deepEqual(ultraHeroTitleParts("Encuentra tu próximo inmueble"), {
      lead: "Encuentra tu próximo",
      accent: "inmueble",
    });
  });
});

describe("uniquePhotoUrls", () => {
  it("skips blanks and exact duplicates up to the limit", () => {
    assert.deepEqual(
      uniquePhotoUrls([" a ", "a", "", "b", "c", "d"], 3),
      ["a", "b", "c"],
    );
  });
});
