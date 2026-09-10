import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampYellowGalleryIndex,
  yellowGalleryIndexAfterKey,
  yellowGalleryUrlAfterFailure,
} from "./yellow-gallery-urls.ts";

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

describe("clampYellowGalleryIndex", () => {
  it("clamps without wrapping", () => {
    assert.equal(clampYellowGalleryIndex(-1, 3), 0);
    assert.equal(clampYellowGalleryIndex(0, 3), 0);
    assert.equal(clampYellowGalleryIndex(2, 3), 2);
    assert.equal(clampYellowGalleryIndex(9, 3), 2);
    assert.equal(clampYellowGalleryIndex(1, 0), 0);
  });
});

describe("yellowGalleryIndexAfterKey", () => {
  it("does not wrap at the ends", () => {
    assert.equal(yellowGalleryIndexAfterKey("ArrowLeft", 0, 3), null);
    assert.equal(yellowGalleryIndexAfterKey("ArrowRight", 2, 3), null);
    assert.equal(yellowGalleryIndexAfterKey("ArrowLeft", 2, 3), 1);
    assert.equal(yellowGalleryIndexAfterKey("ArrowRight", 0, 3), 1);
  });

  it("ignores keys when there is a single photo", () => {
    assert.equal(yellowGalleryIndexAfterKey("ArrowRight", 0, 1), null);
  });
});
