"use client";

import { useId, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { catalogSearchParams } from "@/lib/catalog-pagination";
import {
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
import { ElegantIconSearch } from "@/themes/elegant/elegant-icons";

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
  const params = catalogSearchParams({
    oferta,
    city,
    propertyType,
    bedrooms,
  });
  const resolved =
    langFromForm === "en" || langFromForm === "es" ? langFromForm : locale;
  return `${localizedHref("/", resolved, params, defaultLocale)}#propiedades`;
}

export function ElegantSearch({
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
    );
  }

  return (
    <form
      key={`${oferta}-${city}-${propertyType}-${bedrooms}-${locale}`}
      className="elegant-search"
      method="get"
      action="/#propiedades"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="lang" value={locale} />
      <div className="elegant-search__grid">
        <label>
          <span className="elegant-search__label">{dict.search.operation}</span>
          <select
            id={`${id}-oferta`}
            name="oferta"
            defaultValue={
              oferta === "sale" ? "venta" : oferta === "rent" ? "renta" : "todas"
            }
            className="elegant-field"
          >
            <option value="todas">{dict.search.all}</option>
            <option value="venta">{dict.search.buy}</option>
            <option value="renta">{dict.search.rent}</option>
          </select>
        </label>
        <label>
          <span className="elegant-search__label">{dict.search.location}</span>
          <input
            id={`${id}-city`}
            name="city"
            defaultValue={city}
            placeholder={dict.search.locationPlaceholder}
            className="elegant-field"
          />
        </label>
        <label>
          <span className="elegant-search__label">{dict.search.propertyType}</span>
          <select
            id={`${id}-tipo`}
            name="tipo"
            defaultValue={propertyType}
            className="elegant-field"
          >
            <option value="">{dict.search.allTypes}</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {dict.propertyTypes[type]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="elegant-search__label">{dict.search.bedrooms}</span>
          <select
            id={`${id}-beds`}
            name="recamaras"
            defaultValue={bedrooms}
            className="elegant-field"
          >
            <option value="">{dict.search.any}</option>
            {(["1", "2", "3", "4"] as const).map((count) => (
              <option key={count} value={count}>
                {fillTemplate(dict.search.bedroomsPlus, { count })}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="elegant-btn elegant-btn--gold elegant-search__submit">
          <ElegantIconSearch className="h-4 w-4" />
          {dict.search.submit}
        </button>
      </div>
    </form>
  );
}
