import { DEFAULT_PROPERTY_COUNTRY } from "@/lib/property-types";
import { optionalHalfBathroom } from "@/lib/bathrooms";

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
  if (bed !== undefined) payload.bedrooms = bed;
  const bath = optionalHalfBathroom(fields.bathrooms);
  if (bath !== undefined) payload.bathrooms = bath;
  const built = optionalFloat(fields.builtArea);
  if (built !== undefined) payload.built_area = built;
  const land = optionalFloat(fields.landArea);
  if (land !== undefined) payload.land_area = land;

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
