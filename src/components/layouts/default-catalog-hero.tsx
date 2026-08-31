import type { ReactNode } from "react";
import type { SiteBranding } from "@/lib/site-config-types";

type Props = Pick<SiteBranding, "siteName" | "siteTagline"> & {
  search: ReactNode;
};

/** Estructura mínima: sin gradientes, sin color de marca ni copy de marketing fijo. */
export function DefaultCatalogHero({ siteName, siteTagline, search }: Props) {
  return (
    <section className="border-b border-zinc-200 bg-white pb-10 pt-8 sm:pb-12 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            {siteName}
          </h1>
          {siteTagline ? (
            <p className="mt-3 text-base text-zinc-600">{siteTagline}</p>
          ) : null}
        </div>
        <div className="mt-8 sm:mt-10">{search}</div>
      </div>
    </section>
  );
}
