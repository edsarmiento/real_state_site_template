import Link from "next/link";
import type { Metadata } from "next";
import { ListingOfferBadge } from "@/components/listing-offer-badge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { publicApiFetch } from "@/lib/public-api-fetch";
import {
  catalogOfferQueryValue,
  formatRentCents,
  listingPriceSuffix,
  parseCatalogOfferFilter,
  parseOfferType,
  type CatalogOfferFilter,
  type PublicListingCard,
} from "@/lib/listing-types";
import { propertyTypeLabel } from "@/lib/property-labels";
import type { PropertyType } from "@/lib/property-types";
import { siteName, siteTagline } from "@/lib/site-config";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function param(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

function catalogHref(filter: CatalogOfferFilter, city: string): string {
  const qs = new URLSearchParams();
  if (filter !== "all") qs.set("oferta", catalogOfferQueryValue(filter));
  if (city) qs.set("city", city);
  const s = qs.toString();
  return s ? `/?${s}` : "/";
}

const OFFER_TABS: { id: CatalogOfferFilter; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "rent", label: "Renta" },
  { id: "sale", label: "Venta" },
];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const oferta = parseCatalogOfferFilter(param((await searchParams).oferta));
  const name = siteName();
  if (oferta === "sale") {
    return { title: "Inmuebles en venta", description: `${name} · venta` };
  }
  if (oferta === "rent") {
    return { title: "Rentas disponibles", description: `${name} · rentas` };
  }
  return { title: "Rentas y ventas", description: siteTagline() };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const city = param(sp.city).trim();
  const oferta = parseCatalogOfferFilter(param(sp.oferta));

  const qs = new URLSearchParams();
  if (city) qs.set("city", city);
  if (oferta === "rent") qs.set("offer_type", "rent");
  if (oferta === "sale") qs.set("offer_type", "sale");
  qs.set("limit", "24");

  const result = await publicApiFetch<{
    listings: PublicListingCard[];
    meta: { total: number };
  }>(`/api/public/listings?${qs.toString()}`);

  const listings =
    result.ok && Array.isArray(result.data.listings)
      ? result.data.listings
      : [];
  const total = result.ok ? (result.data.meta?.total ?? listings.length) : 0;

  const heading =
    oferta === "sale"
      ? "Buscar en venta"
      : oferta === "all"
        ? "Buscar inmuebles"
        : "Buscar rentas";

  return (
    <div className="relative min-h-screen bg-[#f3f6fb]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-blue-100/80 to-transparent"
        aria-hidden
      />
      <div className="relative">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6">
          <section className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              {heading}
            </h1>
            <p className="mt-4 text-base text-zinc-600 sm:text-lg">
              {siteTagline()}
            </p>
          </section>

          <nav className="mt-8 flex gap-2" aria-label="Tipo de oferta">
            {OFFER_TABS.map((tab) => {
              const active = oferta === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={catalogHref(tab.id, city)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    active
                      ? "bg-blue-700 text-white"
                      : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-blue-50",
                  ].join(" ")}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          <form
            className="mt-4 flex flex-col gap-3 rounded-2xl bg-white p-3 ring-1 ring-zinc-200 sm:flex-row sm:p-2"
            method="get"
          >
            {oferta !== "all" ? (
              <input
                type="hidden"
                name="oferta"
                value={catalogOfferQueryValue(oferta)}
              />
            ) : null}
            <label className="sr-only" htmlFor="city">
              Ciudad
            </label>
            <input
              id="city"
              name="city"
              defaultValue={city}
              placeholder="Ciudad"
              className="min-w-0 flex-1 rounded-xl px-4 py-3 text-base outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Buscar
            </button>
          </form>

          {!result.ok ? (
            <p className="mt-12 text-sm text-zinc-600">
              No se pudo cargar el catálogo ({result.status}). Revisa{" "}
              <code className="text-xs">ACCOUNT_ID</code> y{" "}
              <code className="text-xs">API_URL</code>.
            </p>
          ) : listings.length === 0 ? (
            <p className="mt-12 text-base text-zinc-600">
              No hay anuncios publicados
              {city ? ` en «${city}»` : ""}.
            </p>
          ) : (
            <section className="mt-12">
              <p className="text-sm text-zinc-500">
                {total} {total === 1 ? "resultado" : "resultados"}
              </p>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((l) => {
                  const offerType = parseOfferType(l.offer_type);
                  const suffix = listingPriceSuffix(offerType);
                  const typeLabel =
                    propertyTypeLabel[l.property_type as PropertyType] ??
                    l.property_type;
                  return (
                    <li key={l.slug}>
                      <Link
                        href={`/inmueble/${l.slug}`}
                        className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 transition hover:shadow-md"
                      >
                        <div className="relative aspect-[4/3] bg-zinc-100">
                          {l.photo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={l.photo_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                              Sin foto
                            </div>
                          )}
                          <ListingOfferBadge
                            offerType={offerType}
                            className="absolute left-3 top-3"
                          />
                        </div>
                        <div className="space-y-2 p-4">
                          <p className="text-xl font-semibold text-blue-700">
                            {formatRentCents(l.rent_cents, l.currency)}
                            {suffix ? (
                              <span className="ml-1 text-sm font-medium text-zinc-500">
                                {suffix}
                              </span>
                            ) : null}
                          </p>
                          <p className="font-semibold text-zinc-950 group-hover:underline">
                            {l.title}
                          </p>
                          <p className="text-sm text-zinc-600">
                            {l.location_label}
                          </p>
                          <p className="text-xs uppercase tracking-wide text-zinc-400">
                            {typeLabel}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
