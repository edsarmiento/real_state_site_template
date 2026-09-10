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
import { YellowIconSearch } from "@/themes/yellow/yellow-icons";

type Props = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  cityOptions: string[];
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
  return `${localizedHref("/", resolved, params, defaultLocale)}#catalogo`;
}

export function YellowSearch({
  oferta,
  city,
  propertyType,
  bedrooms,
  cityOptions,
  locale,
  defaultLocale,
  dict,
}: Props) {
  const router = useRouter();
  const id = useId();
  const offerQuery =
    oferta === "sale" ? "venta" : oferta === "rent" ? "renta" : "todas";
  const offerPills: { id: CatalogOfferFilter; label: string }[] = [
    { id: "sale", label: dict.search.buy },
    { id: "rent", label: dict.search.rent },
    { id: "all", label: dict.search.all },
  ];

  function goOffer(next: CatalogOfferFilter) {
    router.push(
      catalogHref(next, city, propertyType, bedrooms, locale, defaultLocale),
      { scroll: false },
    );
  }

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
      className="yellow-search"
      method="get"
      action="/#catalogo"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="lang" value={locale} />
      <input type="hidden" name="oferta" value={offerQuery} />
      <fieldset className="yellow-search__offers">
        <legend className="yellow-search__label">{dict.search.operation}</legend>
        <div className="yellow-search__pills">
          {offerPills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              className="yellow-search__pill"
              aria-pressed={oferta === pill.id}
              onClick={() => goOffer(pill.id)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="yellow-search__grid">
        <label className="yellow-search__field">
          <span className="yellow-search__label">{dict.search.location}</span>
          {cityOptions.length > 0 ? (
            <select name="city" defaultValue={city} className="yellow-field">
              <option value="">{dict.search.locationPlaceholder}</option>
              {cityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`${id}-city`}
              name="city"
              defaultValue={city}
              placeholder={dict.search.locationPlaceholder}
              className="yellow-field"
            />
          )}
        </label>
        <label className="yellow-search__field">
          <span className="yellow-search__label">{dict.search.propertyType}</span>
          <select
            name="tipo"
            defaultValue={propertyType}
            className="yellow-field"
          >
            <option value="">{dict.search.allTypes}</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {dict.propertyTypes[type]}
              </option>
            ))}
          </select>
        </label>
        <label className="yellow-search__field">
          <span className="yellow-search__label">{dict.search.bedrooms}</span>
          <select
            name="recamaras"
            defaultValue={bedrooms}
            className="yellow-field"
          >
            <option value="">{dict.search.any}</option>
            {(["1", "2", "3"] as const).map((count) => (
              <option key={count} value={count}>
                {fillTemplate(dict.search.bedroomsPlus, { count })}
              </option>
            ))}
          </select>
        </label>
        <div className="yellow-search__submit-wrap">
          <button type="submit" className="yellow-search__submit">
            <YellowIconSearch className="h-4 w-4" />
            {dict.search.submit}
          </button>
        </div>
      </div>
    </form>
  );
}
