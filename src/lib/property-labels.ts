import type { SiteDictionary } from "@/lib/site-i18n";
import type {
  MeasurementSystem,
  PropertyStatus,
  PropertyType,
} from "@/lib/property-types";

export const propertyTypeLabel: Record<PropertyType, string> = {
  house: "Casa",
  apartment: "Apartamento",
  warehouse: "Almacén",
  land: "Terreno",
  office: "Oficina",
  retail: "Local comercial",
  other: "Otro",
};

export function localizedPropertyTypeLabel(
  dict: SiteDictionary | undefined,
  type: PropertyType | string,
): string {
  if (dict && type in dict.propertyTypes) {
    return dict.propertyTypes[type as PropertyType];
  }
  if (type in propertyTypeLabel) {
    return propertyTypeLabel[type as PropertyType];
  }
  return type;
}

export const propertyStatusLabel: Record<PropertyStatus, string> = {
  draft: "Borrador",
  active: "Activa",
  archived: "Archivada",
};

export const measurementLabel: Record<MeasurementSystem, string> = {
  metric: "Métrico",
  imperial: "Imperial",
};
