import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isPublicCatalogPath } from "./access-control.ts";

describe("isPublicCatalogPath", () => {
  it("keeps legal pages public", () => {
    assert.equal(isPublicCatalogPath("/terminos"), true);
    assert.equal(isPublicCatalogPath("/cookies"), true);
    assert.equal(isPublicCatalogPath("/aviso-de-privacidad"), true);
  });

  it("keeps catalog and listing routes public", () => {
    assert.equal(isPublicCatalogPath("/"), true);
    assert.equal(isPublicCatalogPath("/inmueble"), true);
    assert.equal(isPublicCatalogPath("/inmueble/demo"), true);
    assert.equal(isPublicCatalogPath("/robots.txt"), true);
    assert.equal(isPublicCatalogPath("/sitemap.xml"), true);
  });

  it("keeps staff routes protected", () => {
    assert.equal(isPublicCatalogPath("/listings"), false);
    assert.equal(isPublicCatalogPath("/properties"), false);
    assert.equal(isPublicCatalogPath("/account"), false);
  });

  it("ignores query params when classifying public vs protected", () => {
    assert.equal(isPublicCatalogPath("/terminos?lang=en"), true);
    assert.equal(isPublicCatalogPath("/cookies?lang=en"), true);
    assert.equal(isPublicCatalogPath("/aviso-de-privacidad?lang=en"), true);
    assert.equal(isPublicCatalogPath("/inmueble/demo?lang=en"), true);
    assert.equal(isPublicCatalogPath("/listings?lang=en"), false);
    assert.equal(isPublicCatalogPath("/properties?lang=en"), false);
    assert.equal(isPublicCatalogPath("/account?lang=en"), false);
  });
});
