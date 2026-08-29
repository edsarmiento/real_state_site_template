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

export const propertyStatusLabel: Record<PropertyStatus, string> = {
  draft: "Borrador",
  active: "Activa",
  archived: "Archivada",
};

export const measurementLabel: Record<MeasurementSystem, string> = {
  metric: "Métrico",
  imperial: "Imperial",
};
