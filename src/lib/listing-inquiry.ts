"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { parseApiFailureMessage } from "@/lib/listing-types";
import { isMxLocalPhone, onlyPhoneDigits } from "@/lib/phone";
import type { SiteDictionary } from "@/lib/site-i18n";

const GENERIC_FAILURE = "No se pudo completar la solicitud.";

export type ListingInquiryCopy = SiteDictionary["inquiry"];

export async function submitListingInquiry(
  slug: string,
  inquiry: { name: string; phone: string; message: string },
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch(
    `/api/public/listings/${encodeURIComponent(slug)}/inquiries`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiry }),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, message: parseApiFailureMessage(data) };
  }
  return { ok: true };
}

export function useListingInquiry(slug: string, copy?: ListingInquiryCopy) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState("");

  function onPhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhone(onlyPhoneDigits(e.target.value));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const phoneDigits = onlyPhoneDigits(String(fd.get("phone") || phone));
    if (!isMxLocalPhone(phoneDigits)) {
      setError(
        copy?.phoneError ?? "El teléfono debe tener exactamente 10 dígitos.",
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
      setSent(true);
      setPhone("");
      e.currentTarget.reset();
    } finally {
      setPending(false);
    }
  }

  return { error, pending, sent, phone, onPhoneChange, onSubmit };
}
