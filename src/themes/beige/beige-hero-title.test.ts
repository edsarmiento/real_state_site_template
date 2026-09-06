import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { beigeHeroTitleParts } from "./beige-hero-title.ts";

describe("beigeHeroTitleParts", () => {
  it("returns empty parts for blank titles", () => {
    assert.deepEqual(beigeHeroTitleParts(""), { lead: "", accent: "" });
    assert.deepEqual(beigeHeroTitleParts("   "), { lead: "", accent: "" });
  });

  it("accents the whole title when there is a single word", () => {
    assert.deepEqual(beigeHeroTitleParts("Inmuebles"), {
      lead: "",
      accent: "Inmuebles",
    });
  });

  it("accents the last word of a multi-word title", () => {
    assert.deepEqual(beigeHeroTitleParts("Encuentra tu próximo inmueble"), {
      lead: "Encuentra tu próximo",
      accent: "inmueble",
    });
  });

  it("collapses extra whitespace without dropping words", () => {
    const parts = beigeHeroTitleParts("  Find   your next   property  ");
    assert.equal(parts.lead, "Find your next");
    assert.equal(parts.accent, "property");
    assert.equal(`${parts.lead} ${parts.accent}`, "Find your next property");
  });
});
