"use client";

import { useId, useState, type FormEvent } from "react";
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
import { BeigeIconMapPin, BeigeIconSearch } from "@/themes/beige/beige-icons";

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
  const [offer, setOffer] = useState(oferta);
  const offerQuery =
    offer === "sale" ? "venta" : offer === "rent" ? "renta" : "todas";
  const pills: { id: CatalogOfferFilter; value: string; label: string }[] = [
    { id: "sale", value: "venta", label: dict.search.buy },
    { id: "rent", value: "renta", label: dict.search.rent },
    { id: "all", value: "todas", label: dict.search.all },
  ];

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
      className="beige-glow rounded-3xl border border-[#E5D9C5]/80 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:p-8"
      method="get"
      action="/"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="lang" value={locale} />
      <input type="hidden" name="oferta" value={offerQuery} />
      <div className="grid items-end gap-6 md:grid-cols-2 lg:grid-cols-4">
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wider text-[#8A7759]">
            {dict.search.operation}
          </legend>
          <div className="flex rounded-2xl border border-[#E5D9C5] bg-[#FBF9F5] p-1 shadow-inner">
            {pills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setOffer(pill.id)}
                className={`flex-1 rounded-xl py-2 text-xs font-medium transition-all duration-300 ${
                  offer === pill.id
                    ? "bg-white text-[#2D2A26] shadow-sm"
                    : "text-[#A39073] hover:text-[#2D2A26]"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-wider text-[#8A7759]">
          {dict.search.location}
          <span className="relative mt-2 block">
            <BeigeIconMapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A39073]" />
            <input
              id={`${id}-city`}
              name="city"
              defaultValue={city}
              placeholder={dict.search.locationPlaceholder}
              className="beige-field beige-field--icon"
            />
          </span>
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-wider text-[#8A7759]">
          {dict.search.propertyType}
          <select
            name="tipo"
            defaultValue={propertyType}
            className="beige-field mt-2 cursor-pointer"
          >
            <option value="">{dict.search.allTypes}</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {dict.propertyTypes[type]}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-wider text-[#8A7759]">
          {dict.search.bedrooms}
          <select
            name="recamaras"
            defaultValue={bedrooms}
            className="beige-field mt-2 cursor-pointer"
          >
            <option value="">{dict.search.any}</option>
            {(["1", "2", "3", "4"] as const).map((count) => (
              <option key={count} value={count}>
                {fillTemplate(dict.search.bedroomsPlus, { count })}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-6 flex justify-end border-t border-[#F4EFE6] pt-6">
        <button
          type="submit"
          className="beige-btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#A4B494] px-8 py-3.5 text-sm font-medium text-[#2D2A26] shadow-md md:w-auto"
        >
          <BeigeIconSearch className="h-4 w-4" />
          {dict.search.submit}
        </button>
      </div>
    </form>
  );
}
