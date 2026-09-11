import assert from "node:assert/strict";
import { afterEach, it, mock } from "node:test";
import { fetchCatalogLocationListings } from "./catalog-location-listings.ts";

const previousAccount = process.env.ACCOUNT_ID;
afterEach(() => {
  mock.restoreAll();
  if (previousAccount === undefined) delete process.env.ACCOUNT_ID;
  else process.env.ACCOUNT_ID = previousAccount;
});

for (const body of [null, "{}", '{"listings":null}', '{"listings":{}}']) {
  it(`returns no locations for an empty or malformed response: ${body}`, async () => {
    process.env.ACCOUNT_ID = "1";
    mock.method(globalThis, "fetch", async () => new Response(body));
    assert.deepEqual(await fetchCatalogLocationListings(), []);
  });
}
for (const name of ["AbortError", "TimeoutError"]) {
  it(`degrades gracefully on ${name}`, async () => {
    process.env.ACCOUNT_ID = "1";
    mock.method(globalThis, "fetch", async () => { throw new DOMException("cancelled", name); });
    assert.deepEqual(await fetchCatalogLocationListings(), []);
  });
}
it("preserves unexpected errors", async () => {
  process.env.ACCOUNT_ID = "1";
  const error = new Error("unexpected");
  mock.method(globalThis, "fetch", async () => { throw error; });
  await assert.rejects(fetchCatalogLocationListings(), (actual) => actual === error);
});
it("requests unfiltered locations with a timeout and returns the API cards", async () => {
  process.env.ACCOUNT_ID = "1";
  const listings = [{ slug: "sample" }];
  mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    const query = new URL(url).searchParams;
    assert.equal(query.get("limit"), "48");
    assert.equal(query.get("account_id"), "1");
    assert.equal(query.has("city"), false);
    assert.ok(init.signal instanceof AbortSignal);
    return Response.json({ listings });
  });
  assert.deepEqual(await fetchCatalogLocationListings(), listings);
});
