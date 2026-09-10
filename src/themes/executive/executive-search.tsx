"use client";

import { type FormEvent } from "react";
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
import { ExecutiveIconSearch } from "@/themes/executive/executive-icons";
import type { ExecutiveCopy } from "@/themes/executive/executive-copy";

type Props = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  copy: ExecutiveCopy;
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
  return `${localizedHref("/", resolved, params, defaultLocale)}#propiedades`;
}

export function ExecutiveSearch({
  oferta,
  city,
  propertyType,
  bedrooms,
  locale,
  defaultLocale,
  dict,
  copy,
}: Props) {
  const router = useRouter();
  const offerValue = catalogOfferQueryValue(oferta);

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
      key={`${offerValue}|${city}|${propertyType}|${bedrooms}|${locale}`}
      className="executive-search"
      method="get"
      action="/#propiedades"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="lang" value={locale} />
      <div className="executive-search__grid">
        <label className="executive-search__field">
          <span className="executive-search__label">{dict.search.operation}</span>
          <select
            name="oferta"
            defaultValue={offerValue}
            className="executive-field"
          >
            <option value="todas">{dict.search.all}</option>
            <option value="venta">{dict.search.buy}</option>
            <option value="renta">{dict.search.rent}</option>
          </select>
        </label>
        <label className="executive-search__field">
          <span className="executive-search__label">{dict.search.location}</span>
          <input
            name="city"
            defaultValue={city}
            placeholder={copy.locationPlaceholder}
            className="executive-field"
            autoComplete="address-level2"
          />
        </label>
        <label className="executive-search__field">
          <span className="executive-search__label">
            {dict.search.propertyType}
          </span>
          <select
            name="tipo"
            defaultValue={propertyType}
            className="executive-field"
          >
            <option value="">{dict.search.allTypes}</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {dict.propertyTypes[type]}
              </option>
            ))}
          </select>
        </label>
        <label className="executive-search__field">
          <span className="executive-search__label">{dict.search.bedrooms}</span>
          <select
            name="recamaras"
            defaultValue={bedrooms}
            className="executive-field"
          >
            <option value="">{dict.search.any}</option>
            {(["1", "2", "3", "4"] as const).map((count) => (
              <option key={count} value={count}>
                {count === "1"
                  ? copy.bedroomsOne
                  : fillTemplate(copy.bedroomsMany, { count })}
              </option>
            ))}
          </select>
        </label>
        <div className="executive-search__submit-wrap">
          <button type="submit" className="executive-search__submit">
            <ExecutiveIconSearch className="h-4 w-4" />
            {dict.search.submit}
          </button>
        </div>
      </div>
    </form>
  );
}
