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

type FormState = {
  name: string;
  propertyType: string;
  city: string;
  stateOrRegion: string;
  streetAddress: string;
  bedrooms: string;
  bathrooms: string;
  builtArea: string;
  landArea: string;
};

function emptyForm(): FormState {
  return {
    name: "",
    propertyType: "house",
    city: "",
    stateOrRegion: "",
    streetAddress: "",
    bedrooms: "",
    bathrooms: "",
    builtArea: "",
    landArea: "",
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

export function PropertySetupForm() {
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

    if (!form.name.trim() || !form.city.trim() || !form.streetAddress.trim()) {
      setError("Nombre, ciudad y dirección son obligatorios.");
      return;
    }

    const payload: Record<string, string | number | null> = {
      name: form.name.trim(),
      country: DEFAULT_PROPERTY_COUNTRY,
      city: form.city.trim(),
      street_address: form.streetAddress.trim(),
      property_type: form.propertyType,
      status: "active",
      measurement_system: "metric",
      state_or_region: form.stateOrRegion.trim() || null,
    };

    const bed = optInt(form.bedrooms);
    if (bed !== undefined) payload.bedrooms = bed;
    const bath = optInt(form.bathrooms);
    if (bath !== undefined) payload.bathrooms = bath;
    const built = optFloat(form.builtArea);
    if (built !== undefined) payload.built_area = built;
    const land = optFloat(form.landArea);
    if (land !== undefined) payload.land_area = land;

    setPending(true);
    try {
      const res = await fetch("/api/v1/properties", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ property: payload }),
      });
      const data = (await res.json().catch(() => ({}))) as unknown;

      if (!res.ok) {
        applyApiFormErrors(data, setError, setFieldErrors);
        return;
      }

      const property = data as Property;
      if (!property.id) {
        setError("Respuesta inesperada del servidor.");
        return;
      }

      router.push(`/properties/${property.id}/units/new`);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-8">
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
      {fieldErrors ? <ValidationErrorList errors={fieldErrors} /> : null}

      <Section legend="Datos de la propiedad">
        <TextField
          id="name"
          label="Nombre"
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
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

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Continuar → unidad"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
