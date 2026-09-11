/** Pick an existing noninitial thumbnail, including two-photo galleries. */
export function thumbnailTarget(count) {
  return count > 1 ? Math.min(2, count - 1) : null;
}

/** Both the selected control and displayed counter must agree. */
export function thumbnailIsSynced(state, index) {
  return state.activeThumb === index && Number.parseInt(state.counter ?? "", 10) === index + 1;
}

/** A body fallback or an invisible outline is not evidence of keyboard focus. */
export function hasVisibleInteractiveFocus(state) {
  return state.interactive && state.visible && state.focusVisible && (
    (state.outline !== "none" && state.outline !== "hidden" && state.outlineWidth > 0 && state.outlineVisible) ||
    state.shadowVisible
  );
}
