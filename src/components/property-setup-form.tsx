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
import { PROPERTY_TYPES, isLandPropertyType, type Property } from "@/lib/property-types";
import { propertyTypeLabel } from "@/lib/property-labels";
import {
  buildPropertyCreatePayload,
  validatePropertySetupFields,
  BATHROOMS_FIELD_HINT,
  type PropertySetupFields,
} from "@/lib/property-setup-payload";
import {
  applyApiFormErrors,
  type ValidationErrors,
} from "@/lib/validation";

function emptyForm(): PropertySetupFields {
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

export function PropertySetupForm() {
  const router = useRouter();
  const [form, setForm] = useState<PropertySetupFields>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors | null>(null);
  const [pending, setPending] = useState(false);

  function set<K extends keyof PropertySetupFields>(
    key: K,
    value: PropertySetupFields[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setPropertyType(value: string) {
    setForm((prev) => {
      if (!isLandPropertyType(value)) {
        return { ...prev, propertyType: value };
      }
      return {
        ...prev,
        propertyType: value,
        bedrooms: "",
        bathrooms: "",
        builtArea: "",
      };
    });
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

    setPending(true);
    try {
      const res = await fetch("/api/v1/properties", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ property: buildPropertyCreatePayload(form) }),
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
          onChange={(e) => setPropertyType(e.target.value)}
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
        {isLandPropertyType(form.propertyType) ? (
          <TextField
            id="landArea"
            label="Terreno (m²)"
            inputMode="decimal"
            value={form.landArea}
            onChange={(e) => set("landArea", e.target.value)}
          />
        ) : (
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
              hint={BATHROOMS_FIELD_HINT}
              value={form.bathrooms}
              onChange={(e) => set("bathrooms", e.target.value)}
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
        )}
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
