import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  catalogOfferQueryValue,
  parseCatalogOfferFilter,
} from "./listing-offer-filter.ts";

describe("parseCatalogOfferFilter", () => {
  it("accepts Spanish and English offer values", () => {
    assert.equal(parseCatalogOfferFilter("venta"), "sale");
    assert.equal(parseCatalogOfferFilter("sale"), "sale");
    assert.equal(parseCatalogOfferFilter("renta"), "rent");
    assert.equal(parseCatalogOfferFilter("rent"), "rent");
  });

  it("clears unknown or empty values to all", () => {
    assert.equal(parseCatalogOfferFilter("todas"), "all");
    assert.equal(parseCatalogOfferFilter("all"), "all");
    assert.equal(parseCatalogOfferFilter(""), "all");
    assert.equal(parseCatalogOfferFilter("nope"), "all");
    assert.equal(parseCatalogOfferFilter(undefined), "all");
  });
});

describe("catalogOfferQueryValue", () => {
  it("writes the public query spelling used by the catalog URL", () => {
    assert.equal(catalogOfferQueryValue("sale"), "venta");
    assert.equal(catalogOfferQueryValue("rent"), "renta");
    assert.equal(catalogOfferQueryValue("all"), "todas");
  });
});
