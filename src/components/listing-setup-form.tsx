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
import { PROPERTY_TYPES, type Property } from "@/lib/property-types";
import { propertyTypeLabel } from "@/lib/property-labels";
import {
  buildPropertyCreatePayload,
  optionalFloat,
  optionalInt,
  validatePropertySetupFields,
  type PropertySetupFields,
} from "@/lib/property-setup-payload";
import { optionalHalfBathroom, sanitizeHalfBathroomInput, BATHROOMS_FIELD_HINT } from "@/lib/bathrooms";
import {
  applyApiFormErrors,
  type ValidationErrors,
} from "@/lib/validation";
import type { Unit } from "@/lib/unit-types";

type FormState = PropertySetupFields & {
  unitName: string;
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
    unitName: "Principal",
  };
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

    const validationError = validatePropertySetupFields(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!form.unitName.trim()) {
      setError("Indica un nombre para la unidad.");
      return;
    }

    const bed = optionalInt(form.bedrooms);
    const bath = optionalHalfBathroom(form.bathrooms);

    setPending(true);
    try {
      const propertyPayload = buildPropertyCreatePayload({
        ...form,
        name: form.name,
      });

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
      const builtFloat = optionalFloat(form.builtArea);
      if (builtFloat !== undefined) unitBody.built_area = builtFloat;

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
            inputMode="decimal"
            hint={BATHROOMS_FIELD_HINT}
            value={form.bathrooms}
            onChange={(e) =>
              set("bathrooms", sanitizeHalfBathroomInput(e.target.value))
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
