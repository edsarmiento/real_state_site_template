import type { UnitStatus } from "@/lib/unit-types";

export const unitStatusLabel: Record<UnitStatus, string> = {
  available: "Disponible",
  occupied: "Ocupada",
  inactive: "Inactiva",
};
