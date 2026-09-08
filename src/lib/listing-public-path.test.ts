import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listingPublicPath } from "./listing-public-path.ts";

describe("listingPublicPath", () => {
  it("opens the existing listing detail route for a slug", () => {
    assert.equal(
      listingPublicPath("casa-de-3-recamaras-en-santa-fe-tijuana-residencial-burdeos"),
      "/inmueble/casa-de-3-recamaras-en-santa-fe-tijuana-residencial-burdeos",
    );
  });

  it("does not invent a modal or hash-only detail URL", () => {
    const href = listingPublicPath("demo");
    assert.equal(href.startsWith("/inmueble/"), true);
    assert.equal(href.includes("#"), false);
  });
});
