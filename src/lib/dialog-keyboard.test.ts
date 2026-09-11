import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dialogKeyboardAction } from "./dialog-keyboard.ts";

describe("dialogKeyboardAction", () => {
  it("closes on Escape", () => {
    assert.deepEqual(
      dialogKeyboardAction({
        key: "Escape",
        shiftKey: false,
        activeIndex: 0,
        count: 3,
      }),
      { type: "close" },
    );
  });

  it("wraps Tab from the last item to the first", () => {
    assert.deepEqual(
      dialogKeyboardAction({
        key: "Tab",
        shiftKey: false,
        activeIndex: 2,
        count: 3,
      }),
      { type: "focus", index: 0 },
    );
  });

  it("wraps Shift+Tab from the first item to the last", () => {
    assert.deepEqual(
      dialogKeyboardAction({
        key: "Tab",
        shiftKey: true,
        activeIndex: 0,
        count: 3,
      }),
      { type: "focus", index: 2 },
    );
  });
});
