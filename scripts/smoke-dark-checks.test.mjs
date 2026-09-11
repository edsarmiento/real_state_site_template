import assert from "node:assert/strict";
import { test } from "node:test";
import { thumbnailTarget, thumbnailIsSynced, hasVisibleInteractiveFocus } from "./smoke-dark-checks.mjs";

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
  const state = { interactive: true, visible: true, focusVisible: true, outline: "solid", outlineWidth: 2, outlineVisible: true, shadowVisible: false };
  assert.equal(hasVisibleInteractiveFocus(state), true);
  for (const field of ["interactive", "visible", "focusVisible", "outlineVisible"]) {
    assert.equal(hasVisibleInteractiveFocus({ ...state, [field]: false }), false);
  }
  assert.equal(hasVisibleInteractiveFocus({ ...state, outlineWidth: 0 }), false);
  assert.equal(hasVisibleInteractiveFocus({ ...state, outline: "none", shadowVisible: true }), true);
});
