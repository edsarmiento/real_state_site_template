import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dialogKeyboardAction } from "./elegant-dialog-keys.ts";

describe("dialogKeyboardAction", () => {
  it("closes on Escape", () => {
    assert.deepEqual(
      dialogKeyboardAction({
        key: "Escape",
        shiftKey: false,
        activeIndex: 1,
        count: 4,
      }),
      { type: "close" },
    );
  });

  it("wraps Tab from the last control to the first", () => {
    assert.deepEqual(
      dialogKeyboardAction({
        key: "Tab",
        shiftKey: false,
        activeIndex: 3,
        count: 4,
      }),
      { type: "focus", index: 0 },
    );
  });

  it("wraps Shift+Tab from the first control to the last", () => {
    assert.deepEqual(
      dialogKeyboardAction({
        key: "Tab",
        shiftKey: true,
        activeIndex: 0,
        count: 4,
      }),
      { type: "focus", index: 3 },
    );
  });

  it("lets Tab move naturally inside the dialog", () => {
    assert.equal(
      dialogKeyboardAction({
        key: "Tab",
        shiftKey: false,
        activeIndex: 1,
        count: 4,
      }),
      null,
    );
  });
});
