import type { SiteLayoutKey } from "@/lib/site-config-types";

/** Layouts con estilo de marca (gradientes, acentos). `default` = solo estructura. */
export function isStyledSiteLayout(layoutKey: SiteLayoutKey): boolean {
  return layoutKey !== "default";
}
