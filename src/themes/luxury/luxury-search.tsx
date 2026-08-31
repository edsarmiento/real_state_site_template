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
import { LuxuryButton } from "@/themes/luxury/luxury-button";
import {
  LuxuryIconBedrooms,
  LuxuryIconHome,
  LuxuryIconLocation,
  LuxuryIconSearch,
} from "@/themes/luxury/luxury-icons";
import { LuxuryIntentSwitch } from "@/themes/luxury/luxury-intent-switch";
import { LuxurySearchField } from "@/themes/luxury/luxury-search-field";

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

function hrefFromForm(
  form: HTMLFormElement,
  locale: SiteLocale,
  defaultLocale: SiteLocale,
): string {
  const data = new FormData(form);
  return catalogHref(
    parseCatalogOfferFilter(String(data.get("oferta") || "")),
    String(data.get("city") || ""),
    String(data.get("tipo") || ""),
    String(data.get("recamaras") || ""),
    locale,
    defaultLocale,
    String(data.get("lang") || ""),
  );
}

export function LuxurySearch({
  oferta,
  city,
  propertyType,
  bedrooms,
  locale,
  defaultLocale,
  dict,
}: Props) {
  const router = useRouter();
  const typeId = useId();
  const offerOptions = [
    { id: "sale", label: dict.search.buy, value: "venta" },
    { id: "rent", label: dict.search.rent, value: "renta" },
    { id: "all", label: dict.search.all, value: "todas" },
  ];
  const bedroomOptions = [
    { value: "", label: dict.search.any },
    ...(["1", "2", "3", "4"] as const).map((count) => ({
      value: count,
      label: fillTemplate(dict.search.bedroomsPlus, { count }),
    })),
  ];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(hrefFromForm(event.currentTarget, locale, defaultLocale), {
      scroll: false,
    });
  }

  return (
    <form
      className="luxury-finder"
      method="get"
      action="/"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="lang" value={locale} />
      <div className="luxury-finder__intro">
        <p className="luxury-eyebrow">{dict.search.eyebrow}</p>
        <p className="luxury-finder__description">{dict.search.description}</p>
      </div>

      <div className="luxury-finder__divider" role="presentation" />

      <div className="luxury-finder__fields">
        <LuxuryIntentSwitch
          name="oferta"
          legend={dict.search.operation}
          label={dict.search.operation}
          className="luxury-finder__field luxury-finder__field--operation"
          options={offerOptions}
          defaultValue={
            oferta === "sale" ? "venta" : oferta === "rent" ? "renta" : "todas"
          }
        />

        <LuxurySearchField
          label={dict.search.location}
          htmlFor="city"
          icon={<LuxuryIconLocation />}
          wide
        >
          <input
            id="city"
            name="city"
            defaultValue={city}
            placeholder={dict.search.locationPlaceholder}
            className="luxury-field__control luxury-finder__control"
          />
        </LuxurySearchField>

        <LuxurySearchField
          label={dict.search.propertyType}
          htmlFor={`${typeId}-type`}
          icon={<LuxuryIconHome />}
        >
          <span className="luxury-finder__select">
            <select
              id={`${typeId}-type`}
              name="tipo"
              defaultValue={propertyType}
              className="luxury-field__control luxury-finder__control"
            >
              <option value="">{dict.search.allTypes}</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {dict.propertyTypes[type]}
                </option>
              ))}
            </select>
          </span>
        </LuxurySearchField>

        <LuxurySearchField
          label={dict.search.bedrooms}
          htmlFor={`${typeId}-bedrooms`}
          icon={<LuxuryIconBedrooms />}
        >
          <span className="luxury-finder__select">
            <select
              id={`${typeId}-bedrooms`}
              name="recamaras"
              defaultValue={bedrooms}
              className="luxury-field__control luxury-finder__control"
            >
              {bedroomOptions.map((opt) => (
                <option key={opt.value || "any"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </span>
        </LuxurySearchField>

        <div className="luxury-finder__submit">
          <LuxuryButton
            type="submit"
            variant="gold"
            fullWidth
            iconStart={<LuxuryIconSearch />}
            aria-label={dict.search.submit}
          >
            <span className="luxury-finder__submit-full" aria-hidden>
              {dict.search.submit}
            </span>
            <span className="luxury-finder__submit-short" aria-hidden>
              {dict.search.submitShort}
            </span>
          </LuxuryButton>
        </div>
      </div>
    </form>
  );
}