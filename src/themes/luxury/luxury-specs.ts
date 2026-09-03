import type { PublicListingCard } from "@/lib/listing-types";

export type LuxurySpecKey = "bedrooms" | "bathrooms" | "land" | "built";

export type LuxurySpec = {
  key: LuxurySpecKey;
  value: string;
};

function isAbsentSpecValue(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return true;
  const numeric = Number.parseFloat(trimmed.replace(",", "."));
  return Number.isFinite(numeric) && numeric === 0;
}

export function luxuryVisibleSpecs(listing: {
  property_type: string;
  bedrooms: number | null;
  bathrooms: string | null;
  built_area: string | null;
  land_area?: string | null;
}): LuxurySpec[] {
  const specs: LuxurySpec[] = [];
  const land = listing.property_type === "land";

  if (!land && listing.bedrooms != null) {
    specs.push({ key: "bedrooms", value: String(listing.bedrooms) });
  }
  if (!land && listing.bathrooms?.trim()) {
    specs.push({ key: "bathrooms", value: listing.bathrooms.trim() });
  }
  if (listing.land_area && !isAbsentSpecValue(String(listing.land_area))) {
    specs.push({ key: "land", value: `${listing.land_area} m²` });
  }
  if (
    listing.built_area &&
    !land &&
    !isAbsentSpecValue(String(listing.built_area))
  ) {
    specs.push({ key: "built", value: `${listing.built_area} m²` });
  }
  if (
    land &&
    listing.built_area &&
    !listing.land_area &&
    !isAbsentSpecValue(String(listing.built_area))
  ) {
    specs.push({ key: "land", value: `${listing.built_area} m²` });
  }

  return specs;
}

export function luxuryCardSpecLine(
  listing: PublicListingCard,
  labels: {
    specBedroomsShort: string;
  },
): string {
  const parts: string[] = [];
  const land = listing.property_type === "land";
  if (!land && listing.bedrooms != null) {
    parts.push(
      labels.specBedroomsShort.replace("{count}", String(listing.bedrooms)),
    );
  }
  if (!land && listing.bathrooms?.trim()) {
    parts.push(listing.bathrooms.trim());
  }
  if (listing.land_area) parts.push(`${listing.land_area} m²`);
  else if (listing.built_area) parts.push(`${listing.built_area} m²`);
  return parts.join(" · ");
}