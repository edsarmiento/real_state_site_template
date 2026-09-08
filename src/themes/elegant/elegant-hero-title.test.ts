import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { elegantHeroTitleParts } from "./elegant-hero-title.ts";

describe("elegantHeroTitleParts", () => {
  it("uses the configured accent when it appears in the title", () => {
    assert.deepEqual(
      elegantHeroTitleParts("Encuentra tu próximo inmueble", "próximo inmueble"),
      {
        before: "Encuentra tu ",
        accent: "próximo inmueble",
        after: "",
      },
    );
  });

  it("falls back to the last two words when the accent is missing", () => {
    assert.deepEqual(elegantHeroTitleParts("Encuentra tu próximo inmueble", ""), {
      before: "Encuentra tu ",
      accent: "próximo inmueble",
      after: "",
    });
  });

  it("keeps both words in the fallback for a two-word title", () => {
    assert.deepEqual(elegantHeroTitleParts("Propiedades exclusivas", ""), {
      before: "",
      accent: "Propiedades exclusivas",
      after: "",
    });
  });

  it("collapses repeated whitespace without dropping words", () => {
    const parts = elegantHeroTitleParts(
      "  Encuentra   tu   próximo   inmueble  ",
      "próximo inmueble",
    );
    assert.equal(parts.before, "Encuentra tu ");
    assert.equal(parts.accent, "próximo inmueble");
    assert.equal(parts.after, "");
    assert.equal(`${parts.before}${parts.accent}${parts.after}`, "Encuentra tu próximo inmueble");
  });
});
