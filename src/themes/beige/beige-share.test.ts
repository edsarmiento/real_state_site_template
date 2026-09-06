import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildShareData,
  isShareAbortError,
  normalizeShareUrl,
} from "./beige-share.ts";

describe("normalizeShareUrl", () => {
  it("prefers the current listing URL when the pathname matches", () => {
    assert.equal(
      normalizeShareUrl(
        "https://example.com/inmueble/casa",
        "http://localhost:3002/inmueble/casa?lang=es#galeria",
      ),
      "http://localhost:3002/inmueble/casa?lang=es",
    );
  });

  it("keeps a configured URL when the pathname differs", () => {
    assert.equal(
      normalizeShareUrl(
        "https://example.com/inmueble/otra",
        "http://localhost:3002/inmueble/casa",
      ),
      "https://example.com/inmueble/otra",
    );
  });

  it("strips hashes from a standalone URL", () => {
    assert.equal(
      normalizeShareUrl("https://example.com/inmueble/casa#top"),
      "https://example.com/inmueble/casa",
    );
  });
});

describe("buildShareData", () => {
  it("uses the listing title for both title and text", () => {
    assert.deepEqual(
      buildShareData({
        title: " Casa en Tijuana ",
        url: "https://example.com/inmueble/casa",
      }),
      {
        title: "Casa en Tijuana",
        text: "Casa en Tijuana",
        url: "https://example.com/inmueble/casa",
      },
    );
  });
});

describe("isShareAbortError", () => {
  it("detects a cancelled native share", () => {
    assert.equal(
      isShareAbortError(new DOMException("The user aborted", "AbortError")),
      true,
    );
  });

  it("ignores other failures", () => {
    assert.equal(isShareAbortError(new Error("blocked")), false);
    assert.equal(isShareAbortError(null), false);
  });
});
