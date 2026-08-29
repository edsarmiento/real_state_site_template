import type { Property } from "@/lib/property-types";
import type { Tenant } from "@/lib/tenant-types";
import type { Unit } from "@/lib/unit-types";

export type PropertyWithUnits = { property: Property; units: Unit[] };

export type UnitLookup = Map<number, { unit: Unit; property: Property }>;

export function buildUnitLookup(groups: PropertyWithUnits[]): UnitLookup {
  const map: UnitLookup = new Map();
  for (const { property, units } of groups) {
    for (const unit of units) {
      map.set(unit.id, { unit, property });
    }
  }
  return map;
}

export function buildTenantLookup(tenants: Tenant[]): Map<number, Tenant> {
  return new Map(tenants.map((t) => [t.id, t]));
}
