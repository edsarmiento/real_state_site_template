import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  listingsFromCatalogLoad,
  listingsFromCatalogResult,
} from "../../lib/public-hero-catalog-result.ts";

describe("listingsFromCatalogResult", () => {
  it("returns photo sources from a valid listings payload", () => {
    assert.deepEqual(
      listingsFromCatalogResult({
        ok: true,
        data: {
          listings: [
            { photo_url: "https://cdn.example/a.jpg", slug: "a" },
            { photo_url: " https://cdn.example/b.jpg " },
          ],
        },
      }),
      [
        { photo_url: "https://cdn.example/a.jpg" },
        { photo_url: " https://cdn.example/b.jpg " },
      ],
    );
  });

  it("returns an empty list when data is JSON null", () => {
    assert.deepEqual(listingsFromCatalogResult({ ok: true, data: null }), []);
  });

  it("returns an empty list for an empty 2xx body", () => {
    assert.deepEqual(
      listingsFromCatalogResult({ ok: true, data: undefined }),
      [],
    );
  });

  it("returns an empty list when listings is missing", () => {
    assert.deepEqual(
      listingsFromCatalogResult({ ok: true, data: { meta: { total: 0 } } }),
      [],
    );
  });

  it("returns an empty list when listings is an empty array", () => {
    assert.deepEqual(
      listingsFromCatalogResult({ ok: true, data: { listings: [] } }),
      [],
    );
  });

  it("returns an empty list when listings is not an array", () => {
    assert.deepEqual(
      listingsFromCatalogResult({
        ok: true,
        data: { listings: { photo_url: "https://cdn.example/a.jpg" } },
      }),
      [],
    );
  });

  it("does not invent listings from a failed response", () => {
    assert.deepEqual(
      listingsFromCatalogResult({
        ok: false,
        data: { listings: [{ photo_url: "https://cdn.example/a.jpg" }] },
      }),
      [],
    );
  });
});

describe("listingsFromCatalogLoad", () => {
  it("keeps a valid payload", async () => {
    assert.deepEqual(
      await listingsFromCatalogLoad(async () => ({
        ok: true,
        data: { listings: [{ photo_url: "https://cdn.example/a.jpg" }] },
      })),
      [{ photo_url: "https://cdn.example/a.jpg" }],
    );
  });

  it("returns an empty list when the optional fetch throws", async () => {
    assert.deepEqual(
      await listingsFromCatalogLoad(async () => {
        throw new Error("network down");
      }),
      [],
    );
  });
});
