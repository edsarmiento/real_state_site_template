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
  return `${localizedHref("/", resolved, params, defaultLocale)}#catalogo`;
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
      className="beige-search"
      method="get"
      action="/#catalogo"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="lang" value={locale} />
      <input type="hidden" name="oferta" value={offerQuery} />
      <div className="beige-search__grid">
        <fieldset>
          <legend className="beige-search__label">
            {dict.search.operation}
          </legend>
          <div className="beige-search__pills">
            {pills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setOffer(pill.id)}
                aria-pressed={offer === pill.id}
                className={
                  offer === pill.id
                    ? "beige-search__pill is-active"
                    : "beige-search__pill"
                }
              >
                {pill.label}
              </button>
            ))}
          </div>
        </fieldset>
        <label>
          <span className="beige-search__label">{dict.search.location}</span>
          <span className="relative block">
            <BeigeIconMapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--beige-olive)]" />
            <input
              id={`${id}-city`}
              name="city"
              defaultValue={city}
              placeholder={dict.search.locationPlaceholder}
              className="beige-field beige-field--icon"
            />
          </span>
        </label>
        <label>
          <span className="beige-search__label">{dict.search.propertyType}</span>
          <select
            name="tipo"
            defaultValue={propertyType}
            className="beige-field cursor-pointer"
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
          <span className="beige-search__label">{dict.search.bedrooms}</span>
          <select
            name="recamaras"
            defaultValue={bedrooms}
            className="beige-field cursor-pointer"
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
      <div className="beige-search__footer">
        <button type="submit" className="beige-btn beige-search__submit">
          <BeigeIconSearch className="h-4 w-4" />
          {dict.search.submit}
        </button>
      </div>
    </form>
  );
}
