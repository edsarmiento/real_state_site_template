import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { darkHeroTitleParts } from "./dark-hero-title.ts";

describe("darkHeroTitleParts", () => {
  it("returns empty parts for blank titles", () => {
    assert.deepEqual(darkHeroTitleParts(""), { lead: "", accent: "" });
    assert.deepEqual(darkHeroTitleParts("   "), { lead: "", accent: "" });
  });

  it("accents the whole title when there is a single word", () => {
    assert.deepEqual(darkHeroTitleParts("Inmuebles"), {
      lead: "",
      accent: "Inmuebles",
    });
  });

  it("accents the last two words of a four-word title", () => {
    assert.deepEqual(darkHeroTitleParts("Encuentra tu próximo inmueble"), {
      lead: "Encuentra tu",
      accent: "próximo inmueble",
    });
  });

  it("collapses extra whitespace without dropping words", () => {
    const parts = darkHeroTitleParts("  Find   your next   property  ");
    assert.equal(parts.lead, "Find your");
    assert.equal(parts.accent, "next property");
    assert.equal(`${parts.lead} ${parts.accent}`, "Find your next property");
  });
});
