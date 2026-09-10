import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { keepValidPublicListings } from "./dark-listings.ts";

const validListing = {
  slug: "modelo-brisa",
  title: "Modelo Brisa",
  rent_cents: 135000000,
  currency: "MXN",
  offer_type: "sale",
  city: "Tijuana",
  state_or_region: null,
  colony: null,
  location_label: "Zona Cacho",
  property_type: "apartment",
  bedrooms: 2,
  bathrooms: "1",
  built_area: "56",
  land_area: null,
  photo_url: "https://cdn.example/brisa.jpg",
  agency_name: "Agencia",
  agency_logo_url: null,
};

describe("keepValidPublicListings", () => {
  it("keeps a valid listing and drops null, undefined, empty and malformed items", () => {
    const malformedListing = {
      slug: "",
      title: "Broken",
      rent_cents: "nope",
    };
    assert.deepEqual(
      keepValidPublicListings([
        validListing,
        null,
        undefined,
        {},
        malformedListing,
      ]),
      [validListing],
    );
  });

  it("rejects incomplete cards and invalid rendering fields", () => {
    for (const field of ["city", "currency", "location_label", "photo_url", "agency_name"]) {
      const card: Record<string, unknown> = { ...validListing };
      delete card[field];
      assert.deepEqual(keepValidPublicListings([card]), [], field);
      card[field] = 42;
      assert.deepEqual(keepValidPublicListings([card]), [], field);
    }
    assert.deepEqual(keepValidPublicListings([{ ...validListing, photo_url: null }]), [{ ...validListing, photo_url: null }]);
  });

  it("returns an empty list when listings is missing or not an array", () => {
    assert.deepEqual(keepValidPublicListings(null), []);
    assert.deepEqual(keepValidPublicListings(undefined), []);
    assert.deepEqual(keepValidPublicListings({ listings: [validListing] }), []);
    assert.deepEqual(keepValidPublicListings([]), []);
  });
});
