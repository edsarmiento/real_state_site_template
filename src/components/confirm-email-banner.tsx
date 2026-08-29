"use client";

import { useState } from "react";
import { WarningBanner } from "@/components/ui";

type Props = {
  email: string;
};

export function ConfirmEmailBanner({ email }: Props) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function resend() {
    setPending(true);
    try {
      await fetch("/api/auth/confirm-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mb-6">
      <WarningBanner>
        Confirma tu correo para publicar anuncios. Puedes guardar borradores
        mientras tanto.
        {done ? (
          <span className="mt-2 block font-medium">
            Si el correo no está confirmado, enviamos un enlace.
          </span>
        ) : (
          <button
            type="button"
            onClick={() => void resend()}
            disabled={pending}
            className="mt-2 block font-medium underline underline-offset-2"
          >
            {pending ? "Enviando…" : "Reenviar correo de confirmación"}
          </button>
        )}
      </WarningBanner>
    </div>
  );
}
