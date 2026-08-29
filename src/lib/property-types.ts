export const PROPERTY_TYPES = [
  "house",
  "apartment",
  "warehouse",
  "land",
  "office",
  "retail",
  "other",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_STATUSES = ["draft", "active", "archived"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const MEASUREMENT_SYSTEMS = ["metric", "imperial"] as const;
export type MeasurementSystem = (typeof MEASUREMENT_SYSTEMS)[number];

/** Product scope is Mexico-only; sent automatically on create/update. */
export const DEFAULT_PROPERTY_COUNTRY = "MX";

export type Property = {
  id: number;
  account_id: number;
  name: string;
  description: string | null;
  property_type: PropertyType;
  status: PropertyStatus;
  country: string;
  city: string;
  state_or_region: string | null;
  postal_code: string | null;
  street_address: string;
  address_line_2: string | null;
  measurement_system: MeasurementSystem;
  latitude: number | null;
  longitude: number | null;
  built_area: number | null;
  land_area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  floors: number | null;
  year_built: number | null;
  property_owner_id: number | null;
  created_at: string;
  updated_at: string;
  /** Distinct listing offer types on this property's units (`rent` / `sale`). */
  listing_offer_types?: Array<"rent" | "sale">;
};

export type PropertyCreateBody = {
  property: {
    name: string;
    country: string;
    city: string;
    street_address: string;
    description?: string;
    property_type?: string;
    status?: string;
    state_or_region?: string;
    postal_code?: string;
    address_line_2?: string;
    measurement_system?: string;
    latitude?: number;
    longitude?: number;
    built_area?: number;
    land_area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parking_spaces?: number;
    floors?: number;
    year_built?: number;
    property_owner_id?: number | null;
  };
};

export type PropertyUpdateBody = {
  property: Record<string, string | number | null | undefined>;
};
