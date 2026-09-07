import Link from "next/link";
import {
  catalogOfferQueryValue,
  type CatalogOfferFilter,
} from "@/lib/listing-types";
import { PROPERTY_TYPES } from "@/lib/property-types";
import { localizedPropertyTypeLabel } from "@/lib/property-labels";
import {
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";

type Props = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  styledLayout?: boolean;
  dict?: SiteDictionary;
  locale?: SiteLocale;
  defaultLocale?: SiteLocale;
  className?: string;
};

function catalogHref(
  oferta: CatalogOfferFilter,
  city: string,
  propertyType: string,
  bedrooms: string,
  locale?: SiteLocale,
  defaultLocale?: SiteLocale,
): string {
  const qs = new URLSearchParams();
  if (oferta !== "all") qs.set("oferta", catalogOfferQueryValue(oferta));
  if (city.trim()) qs.set("city", city.trim());
  if (propertyType) qs.set("tipo", propertyType);
  if (bedrooms) qs.set("recamaras", bedrooms);
  const path = qs.toString() ? `/?${qs.toString()}` : "/";
  if (locale && defaultLocale) {
    return localizedHref(path, locale, null, defaultLocale);
  }
  return path;
}

export function PublicCatalogSearch({
  oferta,
  city,
  propertyType,
  bedrooms,
  styledLayout = true,
  dict,
  locale,
  defaultLocale,
  className,
}: Props) {
  const offerTabs: { id: CatalogOfferFilter; label: string }[] = dict
    ? [
        { id: "rent", label: dict.search.rent },
        { id: "sale", label: dict.search.buy },
        { id: "all", label: dict.search.all },
      ]
    : [
        { id: "rent", label: "Renta" },
        { id: "sale", label: "Venta" },
        { id: "all", label: "Todas" },
      ];

  const bedroomOptions = dict
    ? [
        { value: "", label: dict.search.bedrooms },
        { value: "1", label: dict.search.bedroomsPlus.replace("{count}", "1") },
        { value: "2", label: dict.search.bedroomsPlus.replace("{count}", "2") },
        { value: "3", label: dict.search.bedroomsPlus.replace("{count}", "3") },
        { value: "4", label: dict.search.bedroomsPlus.replace("{count}", "4") },
      ]
    : [
        { value: "", label: "Recámaras" },
        { value: "1", label: "1+" },
        { value: "2", label: "2+" },
        { value: "3", label: "3+" },
        { value: "4", label: "4+" },
      ];

  const focusField =
    "rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-base outline-none focus:bg-white " +
    (styledLayout
      ? "focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      : "focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200");

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-white ${
        styledLayout
          ? "shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)] ring-1 ring-blue-950/10"
          : "border border-zinc-200 shadow-sm"
      }${className ? ` ${className}` : ""}`}
    >
      <nav
        className="flex border-b border-zinc-100"
        aria-label={dict?.search.intentLegend ?? "Tipo de oferta"}
      >
        {offerTabs.map((tab) => {
          const active = oferta === tab.id;
          return (
            <Link
              key={tab.id}
              href={catalogHref(
                tab.id,
                city,
                propertyType,
                bedrooms,
                locale,
                defaultLocale,
              )}
              className={[
                "flex-1 px-4 py-3.5 text-center text-sm font-semibold transition sm:px-6",
                active
                  ? styledLayout
                    ? "border-b-2 border-blue-600 bg-blue-50/80 text-blue-800"
                    : "border-b-2 border-zinc-900 bg-zinc-100 text-zinc-900"
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
        {locale && locale !== defaultLocale ? (
          <input type="hidden" name="lang" value={locale} />
        ) : null}

        <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {dict?.search.location ?? "Ubicación"}
          </span>
          <input
            id="city"
            name="city"
            defaultValue={city}
            placeholder={dict?.search.locationPlaceholder ?? "Ciudad o colonia"}
            className={focusField}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {dict?.search.propertyType ?? "Tipo de inmueble"}
          </span>
          <select
            name="tipo"
            defaultValue={propertyType}
            className={focusField}
          >
            <option value="">{dict?.search.allTypes ?? "Todos"}</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {localizedPropertyTypeLabel(dict, type)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {dict?.search.bedrooms ?? "Recámaras"}
          </span>
          <select
            name="recamaras"
            defaultValue={bedrooms}
            className={focusField}
          >
            {bedroomOptions.map((opt) => (
              <option key={opt.value || "any"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className={`w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-white ${
              styledLayout
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            {dict?.search.submitShort ?? "Buscar"}
          </button>
        </div>
      </form>
    </div>
  );
}
