"use client";

import Link from "next/link";
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
import { DARK_CATALOG_HASH } from "@/themes/dark/dark-ui";
import { DarkIconClose, DarkIconSearch } from "@/themes/dark/dark-icons";

type Props = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  page?: number;
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
  const resolved =
    langFromForm === "en" || langFromForm === "es" ? langFromForm : locale;
  return (
    localizedHref(
      "/",
      resolved,
      catalogSearchParams({
        oferta,
        city,
        propertyType,
        bedrooms,
      }),
      defaultLocale,
    ) + DARK_CATALOG_HASH
  );
}

function hasActiveFilters(
  oferta: CatalogOfferFilter,
  city: string,
  propertyType: string,
  bedrooms: string,
  page: number,
): boolean {
  return (
    oferta !== "all" ||
    Boolean(city.trim()) ||
    Boolean(propertyType.trim()) ||
    Boolean(bedrooms.trim()) ||
    page > 1
  );
}

export function DarkSearch({
  oferta,
  city,
  propertyType,
  bedrooms,
  page = 1,
  locale,
  defaultLocale,
  dict,
}: Props) {
  const router = useRouter();
  const id = useId();
  const clearHref =
    localizedHref(
      "/",
      locale,
      catalogSearchParams({
        oferta: "all",
        city: "",
        propertyType: "",
        bedrooms: "",
      }),
      defaultLocale,
    ) + DARK_CATALOG_HASH;
  const showClear = hasActiveFilters(
    oferta,
    city,
    propertyType,
    bedrooms,
    page,
  );

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
    <div className="dark-search-wrap">
      <form
        id="inventario"
        className="dark-search"
        method="get"
        action="/#propiedades"
        onSubmit={onSubmit}
      >
        <input type="hidden" name="lang" value={locale} />
        <div className="dark-search__grid">
          <label className="dark-search__field">
            <span className="dark-search__label">{dict.search.operation}</span>
            <select
              key={oferta}
              name="oferta"
              defaultValue={
                oferta === "sale"
                  ? "venta"
                  : oferta === "rent"
                    ? "renta"
                    : "todas"
              }
              className="dark-search__control"
            >
              <option value="todas">{dict.search.all}</option>
              <option value="venta">{dict.search.buy}</option>
              <option value="renta">{dict.search.rent}</option>
            </select>
          </label>
          <label className="dark-search__field">
            <span className="dark-search__label">{dict.search.location}</span>
            <input
              key={city}
              id={`${id}-city`}
              name="city"
              defaultValue={city}
              placeholder={dict.search.locationPlaceholder}
              className="dark-search__control"
            />
          </label>
          <label className="dark-search__field">
            <span className="dark-search__label">{dict.search.propertyType}</span>
            <select
              key={propertyType}
              name="tipo"
              defaultValue={propertyType}
              className="dark-search__control"
            >
              <option value="">{dict.search.allTypes}</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {dict.propertyTypes[type]}
                </option>
              ))}
            </select>
          </label>
          <label className="dark-search__field">
            <span className="dark-search__label">{dict.search.bedrooms}</span>
            <select
              key={bedrooms}
              name="recamaras"
              defaultValue={bedrooms}
              className="dark-search__control"
            >
              <option value="">{dict.search.any}</option>
              {(["1", "2", "3", "4"] as const).map((count) => (
                <option key={count} value={count}>
                  {fillTemplate(dict.search.bedroomsPlus, { count })}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="dark-btn dark-search__submit">
            <DarkIconSearch className="h-4 w-4" />
            <span>{dict.search.submit}</span>
          </button>
        </div>
      </form>
      {showClear ? (
        <div className="dark-search__clear-row">
          <Link href={clearHref} className="dark-search__clear" scroll={false}>
            <DarkIconClose className="h-3.5 w-3.5" />
            <span>{dict.results.clearFilters}</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
