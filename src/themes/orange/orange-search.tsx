"use client";

import { useId, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { catalogPageHref } from "@/lib/catalog-pagination";
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
import { OrangeIconSearch } from "@/themes/orange/orange-icons";

type Props = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  resultsLabel: string;
};

function catalogHref(
  oferta: CatalogOfferFilter,
  city: string,
  propertyType: string,
  bedrooms: string,
  locale: SiteLocale,
  defaultLocale: SiteLocale,
): string {
  const params: Record<string, string> = {};
  if (oferta !== "all") params.oferta = catalogOfferQueryValue(oferta);
  if (city.trim()) params.city = city.trim();
  if (propertyType) params.tipo = propertyType;
  if (bedrooms) params.recamaras = bedrooms;
  return catalogPageHref(
    localizedHref("/", locale, params, defaultLocale),
    1,
  );
}

export function OrangeSearch({
  oferta,
  city,
  propertyType,
  bedrooms,
  locale,
  defaultLocale,
  dict,
  resultsLabel,
}: Props) {
  const router = useRouter();
  const typeId = useId();
  const tabs = [
    { id: "rent", label: dict.search.rent, value: "renta" as const },
    { id: "sale", label: dict.search.buy, value: "venta" as const },
    { id: "all", label: dict.search.all, value: "todas" as const },
  ];
  const active =
    oferta === "sale" ? "venta" : oferta === "rent" ? "renta" : "todas";

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
      ),
    );
  }

  return (
    <form
      key={`${oferta}-${city}-${propertyType}-${bedrooms}`}
      className="orange-search"
      method="get"
      action="/#propiedades"
      onSubmit={onSubmit}
    >
      {locale !== defaultLocale ? (
        <input type="hidden" name="lang" value={locale} />
      ) : null}
      <fieldset className="orange-tabs">
        <legend className="sr-only">{dict.search.operation}</legend>
        {tabs.map((tab) => (
          <label
            key={tab.id}
            className={
              active === tab.value ? "orange-tabs__tab is-active" : "orange-tabs__tab"
            }
          >
            <input
              type="radio"
              name="oferta"
              value={tab.value}
              defaultChecked={active === tab.value}
              className="sr-only"
              onChange={(event) => {
                event.currentTarget.form?.requestSubmit();
              }}
            />
            {tab.label}
          </label>
        ))}
      </fieldset>

      <div className="orange-search__grid">
        <label className="orange-field">
          <span>{dict.search.location}</span>
          <input
            name="city"
            defaultValue={city}
            placeholder={dict.search.locationPlaceholder}
          />
        </label>
        <label className="orange-field" htmlFor={`${typeId}-type`}>
          <span>{dict.search.propertyType}</span>
          <select
            id={`${typeId}-type`}
            name="tipo"
            defaultValue={propertyType}
          >
            <option value="">{dict.search.allTypes}</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {dict.propertyTypes[type]}
              </option>
            ))}
          </select>
        </label>
        <label className="orange-field" htmlFor={`${typeId}-rooms`}>
          <span>{dict.search.bedrooms}</span>
          <select
            id={`${typeId}-rooms`}
            name="recamaras"
            defaultValue={bedrooms}
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

      <div className="orange-search__bar">
        <p>{resultsLabel}</p>
        <button type="submit" className="orange-btn orange-btn--terracotta">
          <OrangeIconSearch className="h-4 w-4" />
          {dict.search.submitShort}
        </button>
      </div>
    </form>
  );
}
