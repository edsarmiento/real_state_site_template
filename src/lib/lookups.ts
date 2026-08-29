import { apiFetch } from "@/lib/api-fetch";
import type { Unit } from "@/lib/unit-types";
import type { Property } from "@/lib/property-types";
import {
  buildTenantLookup,
  buildUnitLookup,
  type PropertyWithUnits,
  type UnitLookup,
} from "@/lib/lookup-utils";

export type { PropertyWithUnits, UnitLookup };
export { buildTenantLookup, buildUnitLookup };

export async function fetchPropertyUnits(): Promise<PropertyWithUnits[]> {
  const [propertiesResult, unitsResult] = await Promise.all([
    apiFetch<Property[]>("/api/v1/properties"),
    apiFetch<Unit[]>("/api/v1/units"),
  ]);
  if (!propertiesResult.ok || !Array.isArray(propertiesResult.data)) return [];

  const unitsByProperty = new Map<number, Unit[]>();
  if (unitsResult.ok && Array.isArray(unitsResult.data)) {
    for (const unit of unitsResult.data) {
      const list = unitsByProperty.get(unit.property_id) ?? [];
      list.push(unit);
      unitsByProperty.set(unit.property_id, list);
    }
  }

  return propertiesResult.data.map((property) => ({
    property,
    units: unitsByProperty.get(property.id) ?? [],
  }));
}
