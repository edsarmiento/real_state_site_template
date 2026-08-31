import type { ReactNode } from "react";
import type { SiteBranding } from "@/lib/site-config-types";

type Props = SiteBranding & {
  search: ReactNode;
};

export function DeoCatalogHero({ siteName, siteTagline, search }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 pb-16 pt-10 text-white sm:pb-20 sm:pt-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, var(--site-primary, #b45309), transparent)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            {siteName}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Tu próximo hogar en Tijuana y Baja California
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-300">{siteTagline}</p>
        </div>
        <div className="mt-8 sm:mt-10">{search}</div>
      </div>
    </section>
  );
}
