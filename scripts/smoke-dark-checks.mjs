/** Pick an existing noninitial thumbnail, including two-photo galleries. */
export function thumbnailTarget(count) {
  return count > 1 ? Math.min(2, count - 1) : null;
}

/** Both the selected control and displayed counter must agree. */
export function thumbnailIsSynced(state, index) {
  return state.activeThumb === index && Number.parseInt(state.counter ?? "", 10) === index + 1;
}

/** Inspect each color in a computed box-shadow, without splitting RGB commas. */
export function hasVisibleShadowColor(boxShadow = "none") {
  const colors = boxShadow.matchAll(/\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(([^()]*)\)/gi);
  for (const [, components] of colors) {
    const commaParts = components.split(",");
    const alpha = components.includes("/")
      ? components.slice(components.lastIndexOf("/") + 1).trim()
      : commaParts.length === 4 ? commaParts[3].trim() : "1";
    const value = Number(alpha.endsWith("%") ? alpha.slice(0, -1) : alpha);
    if (Number.isFinite(value) && value > 0) return true;
  }
  return false;
}

/** A body fallback or an invisible outline is not evidence of keyboard focus. */
export function hasVisibleInteractiveFocus(state) {
  return state.interactive && state.visible && state.focusVisible && (
    (state.outline !== "none" && state.outline !== "hidden" && state.outlineWidth > 0 && state.outlineVisible) ||
    hasVisibleShadowColor(state.boxShadow)
  );
}

/** Gallery controls probed individually for keyboard focus (not a single Tab stop). */
export const GALLERY_KEYBOARD_FOCUS_TARGETS = [
  {
    id: "keyboard-focus-nav",
    selector: ".listing-gallery--strip .listing-gallery__nav:not([disabled])",
  },
  {
    id: "keyboard-focus-view-all",
    selector: ".listing-gallery--strip .listing-gallery__view-all",
  },
  {
    id: "keyboard-focus-thumb",
    selector: ".listing-gallery--strip .listing-gallery__thumb",
  },
];

/** Serialize focus probe for the smoke report (includes verdict fields). */
export function keyboardFocusFindingDetail(state) {
  return {
    focusTag: state.tag ?? null,
    className: state.className ?? null,
    hasVisibleInteractiveFocus: hasVisibleInteractiveFocus(state),
    interactive: Boolean(state.interactive),
    visible: Boolean(state.visible),
    focusVisible: Boolean(state.focusVisible),
    outline: state.outline ?? null,
    outlineWidth: state.outlineWidth ?? null,
    boxShadow: state.boxShadow ?? null,
  };
}
