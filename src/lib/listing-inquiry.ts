"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { submitListingInquiry } from "@/lib/listing-inquiry-request";
import { isPrivacyAccepted } from "@/lib/listing-inquiry-privacy";
import { isMxLocalPhone, onlyPhoneDigits } from "@/lib/phone";
import type { SiteDictionary } from "@/lib/site-i18n";

const GENERIC_FAILURE = "No se pudo completar la solicitud.";

export type ListingInquiryCopy = SiteDictionary["inquiry"];
export { submitListingInquiry };

export function useListingInquiry(
  slug: string,
  copy?: ListingInquiryCopy,
  options?: { privacyRequired?: boolean; privacyError?: string },
) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState("");

  function onPhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhone(onlyPhoneDigits(e.target.value));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const phoneDigits = onlyPhoneDigits(String(fd.get("phone") || phone));
    if (!isMxLocalPhone(phoneDigits)) {
      setError(
        copy?.phoneError ?? "El teléfono debe tener exactamente 10 dígitos.",
      );
      return;
    }
    if (options?.privacyRequired && !isPrivacyAccepted(fd.get("privacyAccepted"))) {
      setError(
        options.privacyError ??
          "Debes aceptar el aviso de privacidad para continuar.",
      );
      return;
    }

    setError(null);
    setPending(true);
    try {
      const result = await submitListingInquiry(slug, {
        name: String(fd.get("name") || "").trim(),
        phone: phoneDigits,
        message: String(fd.get("message") || "").trim(),
      });
      if (!result.ok) {
        setError(
          result.message && result.message !== GENERIC_FAILURE
            ? result.message
            : (copy?.requestFailed ?? result.message ?? GENERIC_FAILURE),
        );
        return;
      }
      form.reset();
      setPhone("");
      setSent(true);
    } finally {
      setPending(false);
    }
  }

  return { error, pending, sent, phone, onPhoneChange, onSubmit };
}
