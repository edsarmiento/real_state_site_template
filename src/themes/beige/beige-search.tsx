"use client";

import { useId, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  catalogOfferQueryValue,
  parseCatalogOfferFilter,
  type CatalogOfferFilter,
} from "@/lib/listing-types";
import { PROPERTY_TYPES } from "@/lib/property-types";
import {
  fillTemplate,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { BeigeIconSearch } from "@/themes/beige/beige-icons";

type Props = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
};

function catalogHref(
  oferta: CatalogOfferFilter,
  city: string,
  propertyType: string,
  bedrooms: string,
  locale: SiteLocale,
  defaultLocale: SiteLocale,
  langFromForm?: string,
): string {
  const params: Record<string, string> = {};
  if (oferta !== "all") params.oferta = catalogOfferQueryValue(oferta);
  if (city.trim()) params.city = city.trim();
  if (propertyType) params.tipo = propertyType;
  if (bedrooms) params.recamaras = bedrooms;
  const resolved =
    langFromForm === "en" || langFromForm === "es" ? langFromForm : locale;
  return localizedHref("/", resolved, params, defaultLocale);
}

export function BeigeSearch({
  oferta,
  city,
  propertyType,
  bedrooms,
  locale,
  defaultLocale,
  dict,
}: Props) {
  const router = useRouter();
  const id = useId();
  const field =
    "w-full rounded-none border-0 bg-transparent text-sm text-[#2D2A26] outline-none";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    router.push(
      catalogHref(
        parseCatalogOfferFilter(String(data.get("oferta") || "")),
        String(data.get("city") || ""),
        String(data.get("tipo") || ""),
        String(data.get("recamaras") || ""),
        locale,
        defaultLocale,
        String(data.get("lang") || ""),
      ),
      { scroll: false },
    );
  }

  return (
    <form
      id="inventario"
      className="beige-glow rounded-2xl bg-[#FBF9F5] p-4 shadow-[0_20px_50px_-20px_rgba(45,42,38,0.25)] sm:p-6"
      method="get"
      action="/"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="lang" value={locale} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-[#A39073]">
          {dict.search.operation}
          <select
            name="oferta"
            defaultValue={
              oferta === "sale"
                ? "venta"
                : oferta === "rent"
                  ? "renta"
                  : "todas"
            }
            className={field}
          >
            <option value="venta">{dict.search.buy}</option>
            <option value="renta">{dict.search.rent}</option>
            <option value="todas">{dict.search.all}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-[#A39073]">
          {dict.search.location}
          <input
            id={`${id}-city`}
            name="city"
            defaultValue={city}
            placeholder={dict.search.locationPlaceholder}
            className={field}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-[#A39073]">
          {dict.search.propertyType}
          <select
            name="tipo"
            defaultValue={propertyType}
            className={field}
          >
            <option value="">{dict.search.allTypes}</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {dict.propertyTypes[type]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-[#A39073]">
          {dict.search.bedrooms}
          <select
            name="recamaras"
            defaultValue={bedrooms}
            className={field}
          >
            <option value="">{dict.search.any}</option>
            {(["1", "2", "3", "4"] as const).map((count) => (
              <option key={count} value={count}>
                {fillTemplate(dict.search.bedroomsPlus, { count })}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A4B494] px-4 py-3 text-sm font-semibold text-[#2D2A26] transition hover:bg-[#8F9F81]"
        >
          <BeigeIconSearch className="h-4 w-4" />
          {dict.search.submitShort}
        </button>
      </div>
    </form>
  );
}
