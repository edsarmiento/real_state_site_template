/** True for blank, "undefined"/"null", or numeric zero (areas and bathroom counts). */
export function isAbsentSpecValue(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return true;
  const numeric = Number.parseFloat(trimmed.replace(",", "."));
  return Number.isFinite(numeric) && numeric === 0;
}
