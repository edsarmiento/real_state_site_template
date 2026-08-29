"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ErrorBanner,
  SelectField,
  TextField,
} from "@/components/ui";
import { notify, notifyApiResponseFailure } from "@/lib/notifications";
import { parseApiFailureMessage } from "@/lib/validation";
import { timezoneOptionsFor } from "@/lib/workspace-timezones";

type Props = {
  name: string;
  timezone: string;
  currency: string;
  canEdit: boolean;
};

export function WorkspaceSettingsForm({
  name: initialName,
  timezone: initialTimezone,
  currency,
  canEdit,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const options = timezoneOptionsFor(initialTimezone);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canEdit) return;

    const nextName = name.trim();
    if (!nextName) {
      setError("Indica el nombre de la inmobiliaria.");
      return;
    }

    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/v1/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: { name: nextName, timezone },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(parseApiFailureMessage(data));
        await notifyApiResponseFailure(data);
        return;
      }
      await notify("Workspace actualizado.", { variant: "success" });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (!canEdit) {
    return (
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium text-zinc-500 dark:text-zinc-400">
            Nombre de la inmobiliaria
          </dt>
          <dd className="mt-0.5 text-zinc-900 dark:text-zinc-100">{initialName}</dd>
        </div>
        <div>
          <dt className="font-medium text-zinc-500 dark:text-zinc-400">
            Zona horaria
          </dt>
          <dd className="mt-0.5 text-zinc-900 dark:text-zinc-100">
            {initialTimezone}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-zinc-500 dark:text-zinc-400">
            Moneda
          </dt>
          <dd className="mt-0.5 text-zinc-900 dark:text-zinc-100">{currency}</dd>
        </div>
        <p className="text-zinc-500">
          Solo el staff del workspace puede editar estos datos.
        </p>
      </dl>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <TextField
        id="account-name"
        label="Nombre de la inmobiliaria"
        required
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      <SelectField
        id="account-timezone"
        label="Zona horaria"
        required
        value={timezone}
        onChange={(ev) => setTimezone(ev.target.value)}
      >
        {options.map((z) => (
          <option key={z.value} value={z.value}>
            {z.label}
          </option>
        ))}
      </SelectField>
      <div>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Moneda
        </p>
        <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{currency}</p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          No se puede cambiar desde aquí (afecta cobros e historial).
        </p>
      </div>
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Guardando…" : "Guardar workspace"}
      </Button>
    </form>
  );
}
