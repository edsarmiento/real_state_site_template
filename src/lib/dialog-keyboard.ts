export type DialogKeyAction =
  | { type: "close" }
  | { type: "focus"; index: number };

/** Escape / Tab focus-trap helpers for modal dialogs (e.g. gallery lightbox). */
export function dialogKeyboardAction(input: {
  key: string;
  shiftKey: boolean;
  activeIndex: number;
  count: number;
}): DialogKeyAction | null {
  if (input.key === "Escape") return { type: "close" };
  if (input.key !== "Tab" || input.count === 0) return null;
  if (input.shiftKey && input.activeIndex <= 0) {
    return { type: "focus", index: input.count - 1 };
  }
  if (!input.shiftKey && input.activeIndex >= input.count - 1) {
    return { type: "focus", index: 0 };
  }
  return null;
}
