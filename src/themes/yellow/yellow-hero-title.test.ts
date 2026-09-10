import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { yellowHeroTitleParts } from "./yellow-hero-title";

describe("yellowHeroTitleParts", () => {
  it("returns empty parts for blank titles", () => {
    assert.deepEqual(yellowHeroTitleParts(""), { lead: "", accent: "" });
    assert.deepEqual(yellowHeroTitleParts("   "), { lead: "", accent: "" });
  });

  it("accents the whole title when there is a single word", () => {
    assert.deepEqual(yellowHeroTitleParts("Inmuebles"), {
      lead: "",
      accent: "Inmuebles",
    });
  });

  it("accents the last word of a two-word title", () => {
    assert.deepEqual(yellowHeroTitleParts("Find home"), {
      lead: "Find",
      accent: "home",
    });
  });

  it("accents the last two words of a longer title", () => {
    assert.deepEqual(yellowHeroTitleParts("Encuentra tu próximo inmueble exclusivo"), {
      lead: "Encuentra tu próximo",
      accent: "inmueble exclusivo",
    });
  });

  it("collapses extra whitespace without dropping words", () => {
    const parts = yellowHeroTitleParts("  Find   your next   exclusive property  ");
    assert.equal(parts.lead, "Find your next");
    assert.equal(parts.accent, "exclusive property");
    assert.equal(`${parts.lead} ${parts.accent}`, "Find your next exclusive property");
  });
});
