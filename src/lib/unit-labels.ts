import type { UnitStatus } from "@/lib/unit-types";

/** Product lexicon (MX): domain remains `Unit`; UI says Espacio. */
export const unitEntityLabel = {
  singular: "Espacio",
  plural: "Espacios",
  singularLower: "espacio",
  pluralLower: "espacios",
} as const;

export const unitStatusLabel: Record<UnitStatus, string> = {
  available: "Disponible",
  occupied: "Ocupado",
  inactive: "Inactivo",
};
