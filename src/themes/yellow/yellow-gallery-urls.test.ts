import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampYellowGalleryIndex,
  computeYellowGalleryTrackOffset,
  shouldHandleYellowGalleryArrowKey,
  yellowGalleryIndexAfterKey,
  yellowGalleryUrlAfterFailure,
  yellowGalleryUrlsKey,
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

describe("yellowGalleryUrlsKey", () => {
  it("is stable for equal contents even when array identity differs", () => {
    assert.equal(
      yellowGalleryUrlsKey(["a", "b"]),
      yellowGalleryUrlsKey(["a", "b"].slice()),
    );
  });

  it("changes when URLs change", () => {
    assert.notEqual(
      yellowGalleryUrlsKey(["a", "b"]),
      yellowGalleryUrlsKey(["a", "c"]),
    );
  });
});

describe("computeYellowGalleryTrackOffset", () => {
  it("keeps the first slide at offset 0", () => {
    assert.equal(
      computeYellowGalleryTrackOffset({
        viewportWidth: 400,
        trackWidth: 1200,
        slideOffsetLeft: 0,
      }),
      0,
    );
  });

  it("scrolls to a later slide without exceeding the max", () => {
    assert.equal(
      computeYellowGalleryTrackOffset({
        viewportWidth: 400,
        trackWidth: 1000,
        slideOffsetLeft: 500,
      }),
      500,
    );
    assert.equal(
      computeYellowGalleryTrackOffset({
        viewportWidth: 400,
        trackWidth: 1000,
        slideOffsetLeft: 900,
      }),
      600,
    );
  });

  it("stays at 0 when the track fits in the viewport", () => {
    assert.equal(
      computeYellowGalleryTrackOffset({
        viewportWidth: 800,
        trackWidth: 500,
        slideOffsetLeft: 200,
      }),
      0,
    );
  });
});

describe("shouldHandleYellowGalleryArrowKey", () => {
  it("navigates only with focus inside the region", () => {
    assert.equal(
      shouldHandleYellowGalleryArrowKey({
        key: "ArrowRight",
        index: 0,
        count: 3,
        focusInsideRegion: true,
        targetIsEditable: false,
      }),
      1,
    );
    assert.equal(
      shouldHandleYellowGalleryArrowKey({
        key: "ArrowRight",
        index: 0,
        count: 3,
        focusInsideRegion: false,
        targetIsEditable: false,
      }),
      null,
    );
  });

  it("ignores editable targets even inside the region", () => {
    assert.equal(
      shouldHandleYellowGalleryArrowKey({
        key: "ArrowLeft",
        index: 1,
        count: 3,
        focusInsideRegion: true,
        targetIsEditable: true,
      }),
      null,
    );
  });

  it("does nothing for zero or one image", () => {
    assert.equal(
      shouldHandleYellowGalleryArrowKey({
        key: "ArrowRight",
        index: 0,
        count: 0,
        focusInsideRegion: true,
        targetIsEditable: false,
      }),
      null,
    );
    assert.equal(
      shouldHandleYellowGalleryArrowKey({
        key: "ArrowRight",
        index: 0,
        count: 1,
        focusInsideRegion: true,
        targetIsEditable: false,
      }),
      null,
    );
  });
});
