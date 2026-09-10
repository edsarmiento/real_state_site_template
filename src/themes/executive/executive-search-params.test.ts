import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { catalogSearchParams } from "../../lib/catalog-pagination.ts";

/**
 * ExecutiveSearch and ExecutivePagination both serialize filters via
 * catalogSearchParams. These cases lock the shared contract the search form
 * must keep aligned with pagination links.
 */
describe("catalogSearchParams (Executive search/pagination contract)", () => {
  it("serializes sale filters without inventing empty keys", () => {
    assert.deepEqual(
      catalogSearchParams({
        oferta: "sale",
        city: " Monterrey ",
        propertyType: "house",
        bedrooms: "2",
      }),
      {
        oferta: "venta",
        city: "Monterrey",
        tipo: "house",
        recamaras: "2",
      },
    );
  });

  it("omits oferta when the filter is all", () => {
    assert.deepEqual(
      catalogSearchParams({
        oferta: "all",
        city: "",
        propertyType: "",
        bedrooms: "",
      }),
      {},
    );
  });

  it("serializes rent the same way pagination expects", () => {
    assert.deepEqual(
      catalogSearchParams({
        oferta: "rent",
        city: "Tijuana",
        propertyType: "",
        bedrooms: "",
      }),
      {
        oferta: "renta",
        city: "Tijuana",
      },
    );
  });
});
