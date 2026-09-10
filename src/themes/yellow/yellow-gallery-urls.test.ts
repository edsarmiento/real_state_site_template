import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { yellowGalleryUrlAfterFailure } from "./yellow-gallery-urls";

describe("yellowGalleryUrlAfterFailure", () => {
  it("keeps the active photo when an earlier URL fails", () => {
    assert.equal(
      yellowGalleryUrlAfterFailure(["A", "B", "C", "D"], "B", "C"),
      "C",
    );
  });

  it("keeps the active photo when a later URL fails", () => {
    assert.equal(
      yellowGalleryUrlAfterFailure(["A", "B", "C", "D"], "D", "C"),
      "C",
    );
  });

  it("moves to the next remaining photo when the active URL fails", () => {
    assert.equal(
      yellowGalleryUrlAfterFailure(["A", "B", "C", "D"], "C", "C"),
      "D",
    );
  });

  it("moves to the previous photo when the last URL fails", () => {
    assert.equal(
      yellowGalleryUrlAfterFailure(["A", "B", "C"], "C", "C"),
      "B",
    );
  });
});
