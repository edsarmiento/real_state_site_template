import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  elegantLocationHash,
  remapElegantSectionHash,
} from "./elegant-section-hash.ts";

describe("remapElegantSectionHash", () => {
  it("maps Beige-style hashes onto Elegant section ids", () => {
    assert.equal(remapElegantSectionHash("#catalogo"), "propiedades");
    assert.equal(remapElegantSectionHash("about"), "sobre-nosotros");
    assert.equal(remapElegantSectionHash("#process"), "como-trabajamos");
  });

  it("keeps Elegant hashes unchanged", () => {
    assert.equal(remapElegantSectionHash("#propiedades"), "propiedades");
    assert.equal(remapElegantSectionHash("#contacto"), "contacto");
  });

  it("rewrites a legacy catalog hash for in-page scroll", () => {
    assert.equal(elegantLocationHash("#catalogo"), "#propiedades");
    assert.equal(elegantLocationHash("#propiedades"), "#propiedades");
    assert.equal(elegantLocationHash(""), "");
  });
});
