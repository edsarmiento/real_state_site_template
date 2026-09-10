import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyPublicApiFetchError,
  publicApiNetworkFailureResult,
} from "./public-api-fetch-transport.ts";

describe("classifyPublicApiFetchError", () => {
  it("marks AbortError as aborted (caller must rethrow — no status invented)", () => {
    assert.equal(
      classifyPublicApiFetchError(
        Object.assign(new Error("aborted"), { name: "AbortError" }),
      ),
      "aborted",
    );
  });

  it("marks TimeoutError as aborted (distinct from network; still rethrown)", () => {
    assert.equal(
      classifyPublicApiFetchError(
        Object.assign(new Error("timeout"), { name: "TimeoutError" }),
      ),
      "aborted",
    );
  });

  it("marks typical fetch/network failures as network", () => {
    assert.equal(
      classifyPublicApiFetchError(
        Object.assign(new TypeError("fetch failed"), {
          cause: { code: "ECONNREFUSED" },
        }),
      ),
      "network",
    );
    assert.equal(
      classifyPublicApiFetchError(new TypeError("Failed to fetch")),
      "network",
    );
  });

  it("does not treat arbitrary exceptions as network failures", () => {
    assert.equal(classifyPublicApiFetchError(new Error("boom")), "unknown");
    assert.equal(
      classifyPublicApiFetchError(new TypeError("Cannot read properties")),
      "unknown",
    );
    assert.equal(classifyPublicApiFetchError("string-throw"), "unknown");
  });
});

describe("publicApiNetworkFailureResult", () => {
  it("only documents network as typed 503", () => {
    assert.deepEqual(publicApiNetworkFailureResult(), {
      ok: false,
      data: null,
      status: 503,
    });
  });
});
