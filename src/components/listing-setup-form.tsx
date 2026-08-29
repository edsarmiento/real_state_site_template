"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  Button,
  ErrorBanner,
  Section,
  SelectField,
  TextField,
  ValidationErrorList,
} from "@/components/ui";
import {
  DEFAULT_PROPERTY_COUNTRY,
  PROPERTY_TYPES,
  type Property,
} from "@/lib/property-types";
import { propertyTypeLabel } from "@/lib/property-labels";
import {
  applyApiFormErrors,
  type ValidationErrors,
} from "@/lib/validation";
import type { Unit } from "@/lib/unit-types";

type FormState = {
  propertyName: string;
  propertyType: string;
  city: string;
  stateOrRegion: string;
  streetAddress: string;
  bedrooms: string;
  bathrooms: string;
  builtArea: string;
  landArea: string;
  unitName: string;
};

function emptyForm(): FormState {
  return {
    propertyName: "",
    propertyType: "house",
    city: "",
    stateOrRegion: "",
    streetAddress: "",
    bedrooms: "",
    bathrooms: "",
    builtArea: "",
    landArea: "",
    unitName: "Principal",
  };
}

function optInt(s: string): number | null | undefined {
  const t = s.trim();
  if (!t) return undefined;
  const n = parseInt(t, 10);
  if (Number.isNaN(n)) return null;
  return n;
}

function optFloat(s: string): number | null | undefined {
  const t = s.trim();
  if (!t) return undefined;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function ListingSetupForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors | null>(null);
  const [pending, setPending] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors(null);

    if (
      !form.propertyName.trim() ||
      !form.city.trim() ||
      !form.streetAddress.trim()
    ) {
      setError("Nombre, ciudad y dirección son obligatorios.");
      return;
    }
    if (!form.unitName.trim()) {
      setError("Indica un nombre para la unidad.");
      return;
    }

    const propertyPayload: Record<string, string | number | null> = {
      name: form.propertyName.trim(),
      country: DEFAULT_PROPERTY_COUNTRY,
      city: form.city.trim(),
      street_address: form.streetAddress.trim(),
      property_type: form.propertyType,
      status: "active",
      measurement_system: "metric",
      state_or_region: form.stateOrRegion.trim() || null,
    };

    const bed = optInt(form.bedrooms);
    if (bed !== undefined) propertyPayload.bedrooms = bed;
    const bath = optInt(form.bathrooms);
    if (bath !== undefined) propertyPayload.bathrooms = bath;
    const built = optFloat(form.builtArea);
    if (built !== undefined) propertyPayload.built_area = built;
    const land = optFloat(form.landArea);
    if (land !== undefined) propertyPayload.land_area = land;

    setPending(true);
    try {
      const propertyRes = await fetch("/api/v1/properties", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ property: propertyPayload }),
      });
      const propertyData = (await propertyRes.json().catch(() => ({}))) as unknown;

      if (!propertyRes.ok) {
        applyApiFormErrors(propertyData, setError, setFieldErrors);
        return;
      }

      const property = propertyData as Property;
      if (!property.id) {
        setError("No se pudo crear la propiedad.");
        return;
      }

      const unitBody: Record<string, string | number | null> = {
        name: form.unitName.trim(),
        status: "available",
      };
      if (bed !== undefined) unitBody.bedrooms = bed;
      if (bath !== undefined) unitBody.bathrooms = bath;
      if (built !== undefined) unitBody.built_area = built;

      const unitRes = await fetch(`/api/v1/properties/${property.id}/units`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unit: unitBody }),
      });
      const unitData = (await unitRes.json().catch(() => ({}))) as unknown;

      if (!unitRes.ok) {
        applyApiFormErrors(unitData, setError, setFieldErrors);
        return;
      }

      const unit = unitData as Unit;
      if (!unit.id) {
        setError("La propiedad se creó pero falló la unidad. Agrega una unidad manualmente.");
        router.push(`/properties/${property.id}/units/new`);
        return;
      }

      router.push("/listings/new");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-8">
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
      {fieldErrors ? <ValidationErrorList errors={fieldErrors} /> : null}

      <Section legend="Propiedad">
        <TextField
          id="propertyName"
          label="Nombre"
          required
          hint="Ej. Casa Condesa, Edificio Centro."
          value={form.propertyName}
          onChange={(e) => set("propertyName", e.target.value)}
        />
        <SelectField
          id="propertyType"
          label="Tipo"
          value={form.propertyType}
          onChange={(e) => set("propertyType", e.target.value)}
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {propertyTypeLabel[t]}
            </option>
          ))}
        </SelectField>
        <TextField
          id="city"
          label="Ciudad"
          required
          value={form.city}
          onChange={(e) => set("city", e.target.value)}
        />
        <TextField
          id="streetAddress"
          label="Dirección"
          required
          value={form.streetAddress}
          onChange={(e) => set("streetAddress", e.target.value)}
        />
        <TextField
          id="stateOrRegion"
          label="Estado"
          value={form.stateOrRegion}
          onChange={(e) => set("stateOrRegion", e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <TextField
            id="bedrooms"
            label="Recámaras"
            inputMode="numeric"
            value={form.bedrooms}
            onChange={(e) =>
              set("bedrooms", e.target.value.replace(/\D/g, "").slice(0, 3))
            }
          />
          <TextField
            id="bathrooms"
            label="Baños"
            inputMode="numeric"
            value={form.bathrooms}
            onChange={(e) =>
              set("bathrooms", e.target.value.replace(/\D/g, "").slice(0, 3))
            }
          />
          <TextField
            id="builtArea"
            label="Construcción (m²)"
            inputMode="decimal"
            value={form.builtArea}
            onChange={(e) => set("builtArea", e.target.value)}
          />
          <TextField
            id="landArea"
            label="Terreno (m²)"
            inputMode="decimal"
            value={form.landArea}
            onChange={(e) => set("landArea", e.target.value)}
          />
        </div>
      </Section>

      <Section legend="Unidad">
        <TextField
          id="unitName"
          label="Nombre de la unidad"
          required
          hint='Para una casa o depto único usa "Principal".'
          value={form.unitName}
          onChange={(e) => set("unitName", e.target.value)}
        />
        <p className="text-sm text-zinc-600">
          La unidad queda disponible para renta o venta. Luego creas el anuncio
          con fotos y precio.
        </p>
      </Section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear propiedad y unidad"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() => router.push("/listings")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
