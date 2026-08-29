"use client";

import { useState, type ChangeEvent, type SubmitEvent } from "react";
import {
  parseOfferType,
  parseApiFailureMessage,
  type ListingOfferType,
} from "@/lib/listing-types";

type Props = {
  slug: string;
  offerType?: ListingOfferType | string | null;
};

const PHONE_DIGITS = /^\d{10}$/;

function onlyPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function ListingInquiryForm({ slug, offerType }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState("");
  const isSale = parseOfferType(offerType) === "sale";

  function onPhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhone(onlyPhoneDigits(e.target.value));
  }

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const phoneDigits = onlyPhoneDigits(String(fd.get("phone") || phone));
    if (!PHONE_DIGITS.test(phoneDigits)) {
      setError("El teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    setError(null);
    setPending(true);
    try {
      const res = await fetch(
        `/api/public/listings/${encodeURIComponent(slug)}/inquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inquiry: {
              name: String(fd.get("name") || "").trim(),
              phone: phoneDigits,
              message: String(fd.get("message") || "").trim(),
            },
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(parseApiFailureMessage(data));
        return;
      }
      setSent(true);
      setPhone("");
      e.currentTarget.reset();
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-200">
        Tu mensaje fue enviado. La inmobiliaria se pondrá en contacto contigo.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200">
          {error}
        </p>
      ) : null}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-700">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-zinc-700">
          Teléfono (10 dígitos)
        </label>
        <input
          id="phone"
          name="phone"
          inputMode="numeric"
          required
          value={phone}
          onChange={onPhoneChange}
          className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-zinc-700">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder={
            isSale
              ? "Me interesa este inmueble en venta…"
              : "Me interesa rentar este inmueble…"
          }
          className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
