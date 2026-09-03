"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  DEFAULT_PROPERTY_COUNTRY,
  MEASUREMENT_SYSTEMS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type Property,
} from "@/lib/property-types";
import {
  measurementLabel,
  propertyStatusLabel,
  propertyTypeLabel,
} from "@/lib/property-labels";
import { optionalFloat, optionalInt, BATHROOMS_FIELD_HINT, normalizeBathroomLabel } from "@/lib/property-setup-payload";
import {
  applyApiFormErrors,
  type ValidationErrors,
} from "@/lib/validation";
import {
  Button,
  ErrorBanner,
  Section,
  SelectField,
  TextAreaField,
  TextField,
  ValidationErrorList,
} from "@/components/ui";

type FormState = {
  name: string;
  description: string;
  property_type: string;
  status: string;
  city: string;
  state_or_region: string;
  postal_code: string;
  street_address: string;
  address_line_2: string;
  measurement_system: string;
  latitude: string;
  longitude: string;
  built_area: string;
  land_area: string;
  bedrooms: string;
  bathrooms: string;
  parking_spaces: string;
  floors: string;
  year_built: string;
};

function emptyForm(): FormState {
  return {
    name: "",
    description: "",
    property_type: "house",
    status: "active",
    city: "",
    state_or_region: "",
    postal_code: "",
    street_address: "",
    address_line_2: "",
    measurement_system: "metric",
    latitude: "",
    longitude: "",
    built_area: "",
    land_area: "",
    bedrooms: "",
    bathrooms: "",
    parking_spaces: "",
    floors: "",
    year_built: "",
  };
}

function formFromProperty(p: Property): FormState {
  return {
    name: p.name,
    description: p.description ?? "",
    property_type: p.property_type,
    status: p.status,
    city: p.city,
    state_or_region: p.state_or_region ?? "",
    postal_code: p.postal_code ?? "",
    street_address: p.street_address,
    address_line_2: p.address_line_2 ?? "",
    measurement_system: p.measurement_system,
    latitude: p.latitude != null ? String(p.latitude) : "",
    longitude: p.longitude != null ? String(p.longitude) : "",
    built_area: p.built_area != null ? String(p.built_area) : "",
    land_area: p.land_area != null ? String(p.land_area) : "",
    bedrooms: p.bedrooms != null ? String(p.bedrooms) : "",
    bathrooms: p.bathrooms ?? "",
    parking_spaces: p.parking_spaces != null ? String(p.parking_spaces) : "",
    floors: p.floors != null ? String(p.floors) : "",
    year_built: p.year_built != null ? String(p.year_built) : "",
  };
}

function toPayload(f: FormState): Record<string, string | number | null> {
  const lat = optionalFloat(f.latitude);
  const lng = optionalFloat(f.longitude);

  const p: Record<string, string | number | null> = {
    name: f.name.trim(),
    country: DEFAULT_PROPERTY_COUNTRY,
    city: f.city.trim(),
    street_address: f.street_address.trim(),
    property_type: f.property_type,
    status: f.status,
    measurement_system: f.measurement_system,
    description: f.description.trim() || null,
    state_or_region: f.state_or_region.trim() || null,
    postal_code: f.postal_code.trim() || null,
    address_line_2: f.address_line_2.trim() || null,
    latitude: lat === undefined ? null : lat,
    longitude: lng === undefined ? null : lng,
  };

  for (const [key, raw] of [
    ["built_area", f.built_area],
    ["land_area", f.land_area],
  ] as const) {
    const v = optionalFloat(raw);
    if (v !== undefined) p[key] = v;
  }

  for (const [key, raw] of [
    ["bedrooms", f.bedrooms],
    ["parking_spaces", f.parking_spaces],
    ["floors", f.floors],
    ["year_built", f.year_built],
  ] as const) {
    const v = optionalInt(raw);
    if (v !== undefined) p[key] = v;
  }

  p.bathrooms = normalizeBathroomLabel(f.bathrooms);

  return p;
}

type Props =
  | { mode: "create" }
  | { mode: "edit"; property: Property };

export function PropertyForm(props: Props) {
  const router = useRouter();
  const property = props.mode === "edit" ? props.property : undefined;
  const initial = useMemo(
    () => (property ? formFromProperty(property) : emptyForm()),
    [property],
  );
  const [form, setForm] = useState<FormState>(initial);
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

    if (!form.name.trim() || !form.city.trim() || !form.street_address.trim()) {
      setError("Nombre, ciudad y dirección son obligatorios.");
      return;
    }

    if (form.latitude.trim() && optionalFloat(form.latitude) === null) {
      setError("La latitud no es válida.");
      return;
    }
    if (form.longitude.trim() && optionalFloat(form.longitude) === null) {
      setError("La longitud no es válida.");
      return;
    }

    setPending(true);
    try {
      const url =
        props.mode === "create"
          ? "/api/v1/properties"
          : `/api/v1/properties/${props.property.id}`;
      const res = await fetch(url, {
        method: props.mode === "create" ? "POST" : "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ property: toPayload(form) }),
      });
      const data = (await res.json().catch(() => ({}))) as unknown;

      if (!res.ok) {
        applyApiFormErrors(data, setError, setFieldErrors);
        return;
      }

      const saved = data as Property;
      if (!saved.id) {
        setError("Respuesta inesperada del servidor.");
        return;
      }
      router.push(`/properties/${saved.id}`);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="mx-auto max-w-3xl space-y-8 px-4 py-8"
    >
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
      {fieldErrors ? <ValidationErrorList errors={fieldErrors} /> : null}

      <Section legend="Datos principales">
        <TextField
          id="name"
          label="Nombre"
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <TextAreaField
          id="description"
          label="Descripción"
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="property_type"
            label="Tipo"
            value={form.property_type}
            onChange={(e) => set("property_type", e.target.value)}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {propertyTypeLabel[t]}
              </option>
            ))}
          </SelectField>
          <SelectField
            id="status"
            label="Estado"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {PROPERTY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {propertyStatusLabel[s]}
              </option>
            ))}
          </SelectField>
        </div>
      </Section>

      <Section legend="Ubicación">
        <TextField
          id="city"
          label="Ciudad"
          required
          value={form.city}
          onChange={(e) => set("city", e.target.value)}
        />
        <TextField
          id="street_address"
          label="Dirección"
          required
          value={form.street_address}
          onChange={(e) => set("street_address", e.target.value)}
        />
        <TextField
          id="address_line_2"
          label="Colonia"
          value={form.address_line_2}
          onChange={(e) => set("address_line_2", e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="state_or_region"
            label="Estado"
            value={form.state_or_region}
            onChange={(e) => set("state_or_region", e.target.value)}
          />
          <TextField
            id="postal_code"
            label="Código postal"
            value={form.postal_code}
            onChange={(e) => set("postal_code", e.target.value)}
          />
        </div>
        <SelectField
          id="measurement_system"
          label="Sistema de medidas"
          value={form.measurement_system}
          onChange={(e) => set("measurement_system", e.target.value)}
        >
          {MEASUREMENT_SYSTEMS.map((m) => (
            <option key={m} value={m}>
              {measurementLabel[m]}
            </option>
          ))}
        </SelectField>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="latitude"
            label="Latitud"
            inputMode="decimal"
            hint="Opcional. Para mostrar mapa en el anuncio."
            value={form.latitude}
            onChange={(e) => set("latitude", e.target.value)}
          />
          <TextField
            id="longitude"
            label="Longitud"
            inputMode="decimal"
            hint="Opcional. Para mostrar mapa en el anuncio."
            value={form.longitude}
            onChange={(e) => set("longitude", e.target.value)}
          />
        </div>
      </Section>

      <Section legend="Características">
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
            id="parking_spaces"
            label="Estacionamientos"
            inputMode="numeric"
            value={form.parking_spaces}
            onChange={(e) =>
              set("parking_spaces", e.target.value.replace(/\D/g, "").slice(0, 3))
            }
          />
          <TextField
            id="built_area"
            label="Superficie construida"
            inputMode="decimal"
            value={form.built_area}
            onChange={(e) => set("built_area", e.target.value)}
          />
          <TextField
            id="land_area"
            label="Terreno"
            inputMode="decimal"
            value={form.land_area}
            onChange={(e) => set("land_area", e.target.value)}
          />
          <TextField
            id="floors"
            label="Plantas"
            inputMode="numeric"
            value={form.floors}
            onChange={(e) =>
              set("floors", e.target.value.replace(/\D/g, "").slice(0, 3))
            }
          />
          <TextField
            id="year_built"
            label="Año de construcción"
            inputMode="numeric"
            value={form.year_built}
            onChange={(e) =>
              set("year_built", e.target.value.replace(/\D/g, "").slice(0, 4))
            }
          />
        </div>
      </Section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : props.mode === "create" ? "Crear propiedad" : "Guardar cambios"}
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
