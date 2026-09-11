import assert from "node:assert/strict";
import { test } from "node:test";
import {
  thumbnailTarget,
  thumbnailIsSynced,
  hasVisibleInteractiveFocus,
  hasVisibleShadowColor,
  GALLERY_KEYBOARD_FOCUS_TARGETS,
  keyboardFocusFindingDetail,
} from "./smoke-dark-checks.mjs";

test("thumbnail targets exist for zero, one, two and many photos", () => {
  assert.equal(thumbnailTarget(0), null);
  assert.equal(thumbnailTarget(1), null);
  assert.equal(thumbnailTarget(2), 1);
  assert.equal(thumbnailTarget(5), 2);
  assert.equal(thumbnailIsSynced({ activeThumb: 1, counter: "2 / 2" }, 1), true);
  assert.equal(thumbnailIsSynced({ activeThumb: 0, counter: "2 / 2" }, 1), false);
  assert.equal(thumbnailIsSynced({ activeThumb: 1, counter: "1 / 2" }, 1), false);
});

test("keyboard focus requires an interactive visible control and visible indicator", () => {
  const state = { interactive: true, visible: true, focusVisible: true, outline: "solid", outlineWidth: 2, outlineVisible: true, boxShadow: "none" };
  assert.equal(hasVisibleInteractiveFocus(state), true);
  for (const field of ["interactive", "visible", "focusVisible", "outlineVisible"]) {
    assert.equal(hasVisibleInteractiveFocus({ ...state, [field]: false }), false);
  }
  assert.equal(hasVisibleInteractiveFocus({ ...state, outlineWidth: 0 }), false);
  assert.equal(hasVisibleInteractiveFocus({ ...state, outline: "none", boxShadow: "rgb(255, 255, 255) 0px 0px 0px 2px" }), true);
});

for (const color of ["rgba(0, 0, 0, 0)", "rgba(255, 255, 255, 0)", "rgba(10, 80, 240, 0.0)", "rgb(255 255 255 / 0%)", "color(display-p3 1 1 1 / 0)"]) {
  test(`transparent shadow cannot pass keyboard focus: ${color}`, () => {
    const boxShadow = `${color} 0px 0px 0px 2px`;
    assert.equal(hasVisibleShadowColor(boxShadow), false);
    assert.equal(hasVisibleInteractiveFocus({ interactive: true, visible: true, focusVisible: true, outline: "none", boxShadow }), false);
  });
}

test("evaluates all shadow colors and allows a nonzero alpha", () => {
  const transparent = "rgba(255, 255, 255, 0) 0px 0px 0px 2px";
  const opaque = "rgb(20, 50, 90) 0px 0px 0px 3px";
  assert.equal(hasVisibleShadowColor("none"), false);
  assert.equal(hasVisibleShadowColor(`${transparent}, rgba(0, 0, 0, 0) 0px 2px 4px`), false);
  assert.equal(hasVisibleShadowColor(`${transparent}, ${opaque}`), true);
  assert.equal(hasVisibleShadowColor(`${opaque}, ${transparent}`), true);
  assert.equal(hasVisibleShadowColor("inset rgba(20, 50, 90, 0.25) 0px 0px 2px"), true);
  assert.equal(hasVisibleShadowColor("rgb(20 50 90 / 25%) 0px 0px 2px"), true);
});

test("gallery keyboard focus targets cover nav, view-all, and thumb", () => {
  assert.deepEqual(
    GALLERY_KEYBOARD_FOCUS_TARGETS.map((t) => t.id),
    [
      "keyboard-focus-nav",
      "keyboard-focus-view-all",
      "keyboard-focus-thumb",
    ],
  );
  assert.match(GALLERY_KEYBOARD_FOCUS_TARGETS[0].selector, /listing-gallery__nav/);
  assert.match(GALLERY_KEYBOARD_FOCUS_TARGETS[1].selector, /listing-gallery__view-all/);
  assert.match(GALLERY_KEYBOARD_FOCUS_TARGETS[2].selector, /listing-gallery__thumb/);
});

test("keyboard focus finding detail exposes focusTag and verdict", () => {
  const detail = keyboardFocusFindingDetail({
    tag: "BUTTON",
    className: "listing-gallery__view-all",
    interactive: true,
    visible: true,
    focusVisible: true,
    outline: "solid",
    outlineWidth: 2,
    outlineVisible: true,
    boxShadow: "none",
  });
  assert.equal(detail.focusTag, "BUTTON");
  assert.equal(detail.className, "listing-gallery__view-all");
  assert.equal(detail.hasVisibleInteractiveFocus, true);
});
