import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  catalogPageItems,
  catalogSearchParams,
  catalogTotalPages,
  parseCatalogPage,
  resolveCatalogPage,
} from "./catalog-pagination.ts";

const PAGE_SIZE = 12;

describe("parseCatalogPage", () => {
  it("returns 1 for empty, invalid, zero, decimal, and negative values", () => {
    assert.equal(parseCatalogPage(""), 1);
    assert.equal(parseCatalogPage("  "), 1);
    assert.equal(parseCatalogPage("abc"), 1);
    assert.equal(parseCatalogPage("0"), 1);
    assert.equal(parseCatalogPage("2.5"), 1);
    assert.equal(parseCatalogPage("-1"), 1);
    assert.equal(parseCatalogPage("-12"), 1);
    assert.equal(parseCatalogPage("page=2"), 1);
  });

  it("parses positive integers", () => {
    assert.equal(parseCatalogPage("1"), 1);
    assert.equal(parseCatalogPage("2"), 2);
    assert.equal(parseCatalogPage(" 9 "), 9);
  });
});

describe("catalogTotalPages", () => {
  it("returns 0 when there are no results", () => {
    assert.equal(catalogTotalPages(0, PAGE_SIZE), 0);
  });

  it("fits 2 and 12 results on a single page", () => {
    assert.equal(catalogTotalPages(2, PAGE_SIZE), 1);
    assert.equal(catalogTotalPages(12, PAGE_SIZE), 1);
  });

  it("needs a second page for 13 results", () => {
    assert.equal(catalogTotalPages(13, PAGE_SIZE), 2);
  });

  it("needs 9 pages for 100 results", () => {
    assert.equal(catalogTotalPages(100, PAGE_SIZE), 9);
  });
});

describe("resolveCatalogPage", () => {
  it("keeps a real empty state when total is 0, even if page is high", () => {
    const resolved = resolveCatalogPage("5", 0, PAGE_SIZE);
    assert.equal(resolved.totalPages, 0);
    assert.equal(resolved.outOfRange, false);
    assert.equal(resolved.page, 5);
    assert.equal(resolved.requestedPage, 5);
  });

  it("clamps page=2 to page 1 when there are only 2 results", () => {
    const resolved = resolveCatalogPage("2", 2, PAGE_SIZE);
    assert.equal(resolved.totalPages, 1);
    assert.equal(resolved.outOfRange, true);
    assert.equal(resolved.page, 1);
  });

  it("keeps page 1 for a full first page of 12 results", () => {
    const resolved = resolveCatalogPage("1", 12, PAGE_SIZE);
    assert.equal(resolved.totalPages, 1);
    assert.equal(resolved.outOfRange, false);
    assert.equal(resolved.page, 1);
  });

  it("allows page 2 when there are 13 results", () => {
    const resolved = resolveCatalogPage("2", 13, PAGE_SIZE);
    assert.equal(resolved.totalPages, 2);
    assert.equal(resolved.outOfRange, false);
    assert.equal(resolved.page, 2);
  });

  it("clamps past the last page when there are 100 results", () => {
    const last = resolveCatalogPage("9", 100, PAGE_SIZE);
    assert.equal(last.totalPages, 9);
    assert.equal(last.outOfRange, false);
    assert.equal(last.page, 9);

    const past = resolveCatalogPage("10", 100, PAGE_SIZE);
    assert.equal(past.outOfRange, true);
    assert.equal(past.page, 9);
  });

  it("treats invalid, negative, and above-total pages safely", () => {
    assert.equal(resolveCatalogPage("nope", 13, PAGE_SIZE).page, 1);
    assert.equal(resolveCatalogPage("-3", 13, PAGE_SIZE).page, 1);
    assert.equal(resolveCatalogPage("0", 13, PAGE_SIZE).page, 1);

    const above = resolveCatalogPage("99", 13, PAGE_SIZE);
    assert.equal(above.outOfRange, true);
    assert.equal(above.page, 2);
    assert.equal(above.requestedPage, 99);
  });
});

describe("catalogPageItems", () => {
  it("shows a single control when totalPages is 0 or 1", () => {
    assert.deepEqual(catalogPageItems(1, 0), [1]);
    assert.deepEqual(catalogPageItems(1, 1), [1]);
  });

  it("lists both pages for 13 results", () => {
    assert.deepEqual(catalogPageItems(2, 2), [1, 2]);
  });

  it("windowed items for 100 results (9 pages)", () => {
    assert.deepEqual(catalogPageItems(1, 9), [1, 2, 3, 4, "ellipsis", 9]);
    assert.deepEqual(catalogPageItems(5, 9), [
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      9,
    ]);
    assert.deepEqual(catalogPageItems(9, 9), [1, "ellipsis", 6, 7, 8, 9]);
  });

  it("widens the neighbor window when siblingCount is 2 (orange)", () => {
    assert.deepEqual(catalogPageItems(1, 15, 2), [
      1,
      2,
      3,
      4,
      5,
      "ellipsis",
      15,
    ]);
    assert.deepEqual(catalogPageItems(8, 15, 2), [
      1,
      "ellipsis",
      6,
      7,
      8,
      9,
      10,
      "ellipsis",
      15,
    ]);
    assert.deepEqual(catalogPageItems(15, 15, 2), [
      1,
      "ellipsis",
      11,
      12,
      13,
      14,
      15,
    ]);
  });
});

describe("catalogSearchParams", () => {
  it("omits default filters so clearing them yields an empty query", () => {
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

  it("keeps combined filters and skips page 1", () => {
    assert.deepEqual(
      catalogSearchParams({
        oferta: "sale",
        city: "Tijuana",
        propertyType: "house",
        bedrooms: "3",
        page: 1,
      }),
      {
        oferta: "venta",
        city: "Tijuana",
        tipo: "house",
        recamaras: "3",
      },
    );
  });

  it("includes page when it is greater than 1", () => {
    assert.deepEqual(
      catalogSearchParams({
        oferta: "rent",
        city: "",
        propertyType: "",
        bedrooms: "2",
        page: 2,
      }),
      { oferta: "renta", recamaras: "2", page: "2" },
    );
  });
});
