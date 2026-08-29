"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  Button,
  ErrorBanner,
  Section,
  SelectField,
  TextField,
  ValidationErrorList,
} from "@/components/ui";
import {
  applyApiFormErrors,
  type ValidationErrors,
} from "@/lib/validation";
import { UNIT_STATUSES, type Unit } from "@/lib/unit-types";
import { unitStatusLabel } from "@/lib/unit-labels";
import type { MeasurementSystem } from "@/lib/property-types";

type FormState = {
  name: string;
  status: string;
  bedrooms: string;
  bathrooms: string;
  builtArea: string;
  floor: string;
  furnished: string;
};

function emptyForm(): FormState {
  return {
    name: "",
    status: "available",
    bedrooms: "",
    bathrooms: "",
    builtArea: "",
    floor: "",
    furnished: "",
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

function toPayload(
  f: FormState,
): Record<string, string | number | boolean | null> {
  const p: Record<string, string | number | boolean | null> = {
    name: f.name.trim(),
    status: f.status,
  };
  const bed = optInt(f.bedrooms);
  if (bed !== undefined) p.bedrooms = bed;
  const bath = optInt(f.bathrooms);
  if (bath !== undefined) p.bathrooms = bath;
  const built = optFloat(f.builtArea);
  if (built !== undefined) p.built_area = built;
  const fl = optInt(f.floor);
  if (fl !== undefined) p.floor = fl;
  if (f.furnished === "true") p.furnished = true;
  else if (f.furnished === "false") p.furnished = false;
  return p;
}

type Props = {
  propertyId: number;
  measurementSystem: MeasurementSystem;
  defaultName?: string;
};

export function UnitForm({
  propertyId,
  measurementSystem,
  defaultName = "",
}: Props) {
  const router = useRouter();
  const initial = useMemo(
    () => ({ ...emptyForm(), name: defaultName }),
    [defaultName],
  );
  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors | null>(null);
  const [pending, setPending] = useState(false);

  const areaUnit = measurementSystem === "imperial" ? "ft²" : "m²";

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors(null);

    if (!form.name.trim()) {
      setError("El nombre de la unidad es obligatorio.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch(`/api/v1/properties/${propertyId}/units`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unit: toPayload(form) }),
      });
      const data: unknown = await res.json().catch(() => ({}));

      if (!res.ok) {
        applyApiFormErrors(data, setError, setFieldErrors);
        return;
      }

      const saved = data as Unit;
      if (!saved.id) {
        setError("Respuesta inesperada del servidor.");
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

      <Section legend="Datos de la unidad">
        <TextField
          id="name"
          label="Nombre"
          required
          hint='Ej. Depto 4A, Local 1, o "Principal" para inmueble único.'
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <SelectField
          id="status"
          label="Estado"
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
        >
          {UNIT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {unitStatusLabel[s]}
            </option>
          ))}
        </SelectField>
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
            inputMode="numeric"
            value={form.bathrooms}
            onChange={(e) =>
              set("bathrooms", e.target.value.replace(/\D/g, "").slice(0, 3))
            }
          />
          <TextField
            id="floor"
            label="Planta"
            inputMode="numeric"
            value={form.floor}
            onChange={(e) =>
              set("floor", e.target.value.replace(/\D/g, "").slice(0, 4))
            }
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="builtArea"
            label={`Superficie (${areaUnit})`}
            inputMode="decimal"
            value={form.builtArea}
            onChange={(e) => set("builtArea", e.target.value)}
          />
          <SelectField
            id="furnished"
            label="Amueblado"
            value={form.furnished}
            onChange={(e) => set("furnished", e.target.value)}
          >
            <option value="">Sin especificar</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </SelectField>
        </div>
      </Section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear unidad y anunciar"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() => router.push("/properties")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
