const HALF_BATH_EPSILON = 0.001;

export function sanitizeHalfBathroomInput(raw: string): string {
  let value = raw.replace(",", ".").replace(/[^\d.]/g, "");
  const dotIndex = value.indexOf(".");
  if (dotIndex !== -1) {
    value =
      value.slice(0, dotIndex + 1) +
      value.slice(dotIndex + 1).replace(/\./g, "");
    const [whole, fraction = ""] = value.split(".");
    value = `${whole}.${fraction.replace(/[^05]/g, "").slice(0, 1)}`;
  }
  return value.slice(0, 5);
}

export function optionalHalfBathroom(
  value: string,
): number | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const normalised = trimmed.replace(",", ".");
  const parsed = Number(normalised);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  const doubled = parsed * 2;
  if (Math.abs(doubled - Math.round(doubled)) > HALF_BATH_EPSILON) return null;
  return Math.round(doubled) / 2;
}

export function formatBathroomsCount(count: number): string {
  return Number.isInteger(count) ? String(count) : count.toFixed(1);
}

export function formatBathroomsLabel(count: number): string {
  const display = formatBathroomsCount(count);
  return `${display} ${count === 1 ? "baño" : "baños"}`;
}

export const BATHROOMS_FIELD_HINT =
  "Usa .5 para medio baño (ej. 2.5 = 2 baños y medio).";
