import { DEFAULT_PROPERTY_COUNTRY, isLandPropertyType } from "@/lib/property-types";

export const BATHROOMS_FIELD_HINT =
  "Texto libre (ej. 1, 1/2, 1 1/2).";

/** Empty string clears the field on update. */
export function normalizeBathroomLabel(value: string): string | null {
  return value.trim() || null;
}

/** Omit from create payloads when empty. */
export function optionalBathroomLabel(
  value: string,
): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

export type PropertySetupFields = {
  name: string;
  propertyType: string;
  city: string;
  stateOrRegion: string;
  streetAddress: string;
  bedrooms: string;
  bathrooms: string;
  builtArea: string;
  landArea: string;
};

export function optionalInt(value: string): number | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = parseInt(trimmed, 10);
  if (Number.isNaN(n)) return null;
  return n;
}

export function optionalFloat(value: string): number | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function buildPropertyCreatePayload(
  fields: PropertySetupFields,
): Record<string, string | number | null> {
  const payload: Record<string, string | number | null> = {
    name: fields.name.trim(),
    country: DEFAULT_PROPERTY_COUNTRY,
    city: fields.city.trim(),
    street_address: fields.streetAddress.trim(),
    property_type: fields.propertyType,
    status: "active",
    measurement_system: "metric",
    state_or_region: fields.stateOrRegion.trim() || null,
  };

  const bed = optionalInt(fields.bedrooms);
  const bath = optionalBathroomLabel(fields.bathrooms);
  const built = optionalFloat(fields.builtArea);
  const land = optionalFloat(fields.landArea);

  if (isLandPropertyType(fields.propertyType)) {
    if (land !== undefined) payload.land_area = land;
  } else {
    if (bed !== undefined) payload.bedrooms = bed;
    if (bath !== undefined) payload.bathrooms = bath;
    if (built !== undefined) payload.built_area = built;
    if (land !== undefined) payload.land_area = land;
  }

  return payload;
}

export function validatePropertySetupFields(
  fields: PropertySetupFields,
): string | null {
  if (!fields.name.trim() || !fields.city.trim() || !fields.streetAddress.trim()) {
    return "Nombre, ciudad y dirección son obligatorios.";
  }
  return null;
}
