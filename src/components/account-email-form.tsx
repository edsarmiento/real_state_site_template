"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ErrorBanner, TextField } from "@/components/ui";
import { notify, notifyApiResponseFailure } from "@/lib/notifications";
import { parseApiFailureMessage } from "@/lib/validation";

type Props = {
  initialEmail: string;
};

export function AccountEmailForm({ initialEmail }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = email.trim().toLowerCase();
    if (!next) {
      setError("Indica un correo electrónico.");
      return;
    }
    if (next === initialEmail.toLowerCase()) {
      setError(null);
      return;
    }

    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/v1/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email: next } }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(parseApiFailureMessage(data));
        await notifyApiResponseFailure(data);
        return;
      }
      await notify("Correo actualizado.", { variant: "success" });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <TextField
        id="user-email"
        label="Email de acceso"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
        hint="Debe ser único; no puede coincidir con el de otro usuario."
      />
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Guardando…" : "Guardar correo"}
      </Button>
    </form>
  );
}
