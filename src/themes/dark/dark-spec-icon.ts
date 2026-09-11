import { DarkIconBath, DarkIconBed, DarkIconHome, DarkIconMaximize } from "@/themes/dark/dark-icons";

export function specIcon(key: string) {
  if (key === "bedrooms") return DarkIconBed;
  if (key === "bathrooms") return DarkIconBath;
  if (key === "land" || key === "built") return DarkIconMaximize;
  return DarkIconHome;
}
