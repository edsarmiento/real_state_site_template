import Link from "next/link";
import {
  catalogOfferQueryValue,
  type CatalogOfferFilter,
} from "@/lib/listing-types";
import { PROPERTY_TYPES } from "@/lib/property-types";
import { propertyTypeLabel } from "@/lib/property-labels";

const OFFER_TABS: { id: CatalogOfferFilter; label: string }[] = [
  { id: "rent", label: "Renta" },
  { id: "sale", label: "Venta" },
  { id: "all", label: "Todas" },
];

const BEDROOM_OPTIONS = [
  { value: "", label: "Recámaras" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

type Props = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
};

function catalogHref(
  oferta: CatalogOfferFilter,
  city: string,
  propertyType: string,
  bedrooms: string,
): string {
  const qs = new URLSearchParams();
  if (oferta !== "all") qs.set("oferta", catalogOfferQueryValue(oferta));
  if (city.trim()) qs.set("city", city.trim());
  if (propertyType) qs.set("tipo", propertyType);
  if (bedrooms) qs.set("recamaras", bedrooms);
  const s = qs.toString();
  return s ? `/?${s}` : "/";
}

export function PublicCatalogSearch({
  oferta,
  city,
  propertyType,
  bedrooms,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)] ring-1 ring-blue-950/10">
      <nav className="flex border-b border-zinc-100" aria-label="Tipo de oferta">
        {OFFER_TABS.map((tab) => {
          const active = oferta === tab.id;
          return (
            <Link
              key={tab.id}
              href={catalogHref(tab.id, city, propertyType, bedrooms)}
              className={[
                "flex-1 px-4 py-3.5 text-center text-sm font-semibold transition sm:px-6",
                active
                  ? "border-b-2 border-blue-600 bg-blue-50/80 text-blue-800"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <form
        className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.75fr)_auto]"
        method="get"
      >
        {oferta !== "all" ? (
          <input
            type="hidden"
            name="oferta"
            value={catalogOfferQueryValue(oferta)}
          />
        ) : null}

        <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Ubicación
          </span>
          <input
            id="city"
            name="city"
            defaultValue={city}
            placeholder="Ciudad o colonia"
            className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-base outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Tipo de inmueble
          </span>
          <select
            name="tipo"
            defaultValue={propertyType}
            className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-base outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Todos</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {propertyTypeLabel[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Recámaras
          </span>
          <select
            name="recamaras"
            defaultValue={bedrooms}
            className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-base outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            {BEDROOM_OPTIONS.map((opt) => (
              <option key={opt.value || "any"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}
