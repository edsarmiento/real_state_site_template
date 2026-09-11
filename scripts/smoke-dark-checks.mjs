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
