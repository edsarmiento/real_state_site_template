import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { executiveHeroTitleParts } from "./executive-hero-title.ts";

describe("executiveHeroTitleParts", () => {
  it("returns empty parts for blank titles", () => {
    assert.deepEqual(executiveHeroTitleParts(""), { lead: "", accent: "" });
    assert.deepEqual(executiveHeroTitleParts("   "), { lead: "", accent: "" });
  });

  it("accents the whole title when there is a single word", () => {
    assert.deepEqual(executiveHeroTitleParts("Inmuebles"), {
      lead: "",
      accent: "Inmuebles",
    });
  });

  it("accents the last word of a multi-word title", () => {
    assert.deepEqual(executiveHeroTitleParts("Encuentra tu próximo inmueble"), {
      lead: "Encuentra tu próximo",
      accent: "inmueble",
    });
  });

  it("collapses extra whitespace without dropping words", () => {
    const parts = executiveHeroTitleParts("  Find   your next   property  ");
    assert.equal(parts.lead, "Find your next");
    assert.equal(parts.accent, "property");
    assert.equal(`${parts.lead} ${parts.accent}`, "Find your next property");
  });
});
