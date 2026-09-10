import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  darkCityKey,
  readableDarkCityName,
  resolveDarkLocations,
} from "./dark-locations.ts";

describe("darkCityKey", () => {
  it("normalizes case, accents and spacing", () => {
    assert.equal(darkCityKey("  TIJUANA  "), "tijuana");
    assert.equal(darkCityKey("Tijuana"), "tijuana");
    assert.equal(darkCityKey("San Quintín"), "san quintin");
  });

  it("matches URL city filter to location filter.city for card selection", () => {
    // Cards link with structured filter.city (may be ALL CAPS from API);
    // URL ?city= must select the same card via normalized key, not display name.
    const filterCity = "TIJUANA";
    const urlCity = "Tijuana";
    assert.equal(darkCityKey(filterCity), darkCityKey(urlCity));
    assert.notEqual(filterCity, urlCity);
  });
});

describe("readableDarkCityName", () => {
  it("title-cases all-caps city labels", () => {
    assert.equal(readableDarkCityName("TIJUANA"), "Tijuana");
  });

  it("preserves mixed-case names", () => {
    assert.equal(readableDarkCityName("San Quintin"), "San Quintin");
  });
});

describe("resolveDarkLocations", () => {
  it("prefers configured editorial locations only", () => {
    const { locations } = resolveDarkLocations(
      [
        {
          id: "tij",
          name: "Tijuana",
          filter: { city: "TIJUANA" },
        },
      ],
      [
        { city: "Ensenada", photo_url: "https://example.com/a.jpg" } as never,
        { city: "TIJUANA", photo_url: "https://example.com/b.jpg" } as never,
      ],
    );
    assert.equal(locations.length, 1);
    assert.equal(locations[0]?.filter.city, "TIJUANA");
  });

  it("dedupes catalog cities by normalized key", () => {
    const { locations } = resolveDarkLocations(
      [],
      [
        { city: "TIJUANA" } as never,
        { city: "Tijuana" } as never,
        { city: " Ensenada " } as never,
      ],
    );
    assert.equal(locations.length, 2);
    assert.equal(locations[0]?.name, "Tijuana");
    assert.equal(locations[0]?.filter.city, "TIJUANA");
  });
});
