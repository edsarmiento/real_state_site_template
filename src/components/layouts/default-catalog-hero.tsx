import type { ReactNode } from "react";
import type { SiteBranding } from "@/lib/site-config-types";

type Props = SiteBranding & {
  search: ReactNode;
};

export function DefaultCatalogHero({
  siteName,
  siteTagline,
  search,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 pb-16 pt-10 text-white sm:pb-20 sm:pt-12">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
            {siteName}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Encuentra tu próximo inmueble
          </h1>
          <p className="mt-4 max-w-xl text-base text-blue-100">{siteTagline}</p>
        </div>
        <div className="mt-8 sm:mt-10">{search}</div>
      </div>
    </section>
  );
}
