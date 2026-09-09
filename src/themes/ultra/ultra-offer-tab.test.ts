import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isUltraOfferTabHref } from "./ultra-offer-tab.ts";

const origin = "https://site.example";
const catalogPath = "/";

describe("isUltraOfferTabHref", () => {
  it("accepts Comprar, Rentar and Todas on the catalog path", () => {
    assert.equal(
      isUltraOfferTabHref(`${origin}/?oferta=venta`, origin, catalogPath),
      true,
    );
    assert.equal(
      isUltraOfferTabHref(`${origin}/?oferta=renta`, origin, catalogPath),
      true,
    );
    assert.equal(isUltraOfferTabHref(`${origin}/`, origin, catalogPath), true);
    assert.equal(
      isUltraOfferTabHref(`${origin}/?city=Roma`, origin, catalogPath),
      true,
    );
  });

  it("accepts English aliases and explicit todas", () => {
    assert.equal(
      isUltraOfferTabHref(`${origin}/?oferta=sale`, origin, catalogPath),
      true,
    );
    assert.equal(
      isUltraOfferTabHref(`${origin}/?oferta=todas`, origin, catalogPath),
      true,
    );
  });

  it("rejects an unknown oferta value", () => {
    assert.equal(
      isUltraOfferTabHref(`${origin}/?oferta=hack`, origin, catalogPath),
      false,
    );
  });

  it("rejects a different origin or listing pathname", () => {
    assert.equal(
      isUltraOfferTabHref("https://other.example/?oferta=venta", origin, catalogPath),
      false,
    );
    assert.equal(
      isUltraOfferTabHref(`${origin}/inmueble/loft?oferta=venta`, origin, catalogPath),
      false,
    );
  });

  it("does not treat pagination as an offer tab", () => {
    assert.equal(
      isUltraOfferTabHref(`${origin}/?page=2`, origin, catalogPath),
      false,
    );
  });
});
