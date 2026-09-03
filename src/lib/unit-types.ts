export const UNIT_STATUSES = ["available", "occupied", "inactive"] as const;
export type UnitStatus = (typeof UNIT_STATUSES)[number];

/** Rentable unit of a property (OpenAPI `Unit`). */
export type Unit = {
  id: number;
  property_id: number;
  name: string;
  status: UnitStatus;
  bedrooms: number | null;
  bathrooms: string | null;
  /** Size in m² (metric) or ft² (imperial), per parent property `measurement_system`. */
  built_area: number | null;
  floor: number | null;
  furnished: boolean | null;
  created_at: string;
  updated_at: string;
};

/** Body for `POST /api/v1/properties/:property_id/units` (`UnitInput`). */
export type UnitCreateBody = {
  unit: {
    name: string;
    status?: UnitStatus;
    bedrooms?: number | null;
    bathrooms?: string | null;
    built_area?: number | null;
    floor?: number | null;
    furnished?: boolean | null;
  };
};

/** Body for `PATCH /api/v1/properties/:property_id/units/:id` — any subset. */
export type UnitUpdateBody = {
  unit: Record<string, string | number | boolean | null | undefined>;
};
