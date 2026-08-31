import type { ReactNode } from "react";
import { DeoCatalogHero } from "@/components/layouts/deo-catalog-hero";
import { DefaultCatalogHero } from "@/components/layouts/default-catalog-hero";
import type { SiteBranding, SiteLayoutKey } from "@/lib/site-config-types";

type Props = SiteBranding & {
  layoutKey: SiteLayoutKey;
  search: ReactNode;
};

export function CatalogHero({ layoutKey, search, ...branding }: Props) {
  if (layoutKey === "deo") {
    return <DeoCatalogHero {...branding} search={search} />;
  }
  return <DefaultCatalogHero {...branding} search={search} />;
}
