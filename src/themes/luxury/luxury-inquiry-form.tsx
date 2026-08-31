"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  parseApiFailureMessage,
  parseOfferType,
  type ListingOfferType,
} from "@/lib/listing-types";
import type { SiteDictionary } from "@/lib/site-i18n";
import { LuxuryButton } from "@/themes/luxury/luxury-button";

type Props = {
  slug: string;
  offerType?: ListingOfferType | string | null;
  dict: SiteDictionary;
};

const PHONE_DIGITS = /^\d{10}$/;

function onlyPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function LuxuryInquiryForm({ slug, offerType, dict }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState("");
  const isSale = parseOfferType(offerType) === "sale";

  function onPhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhone(onlyPhoneDigits(e.target.value));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const phoneDigits = onlyPhoneDigits(String(fd.get("phone") || phone));
    if (!PHONE_DIGITS.test(phoneDigits)) {
      setError(dict.inquiry.phoneError);
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
        const message = parseApiFailureMessage(data);
        setError(
          !message || message === "No se pudo completar la solicitud."
            ? dict.inquiry.requestFailed
            : message,
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

  if (sent) {
    return (
      <p className="luxury-field__hint luxury-inquiry__success" role="status">
        {dict.inquiry.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="luxury-inquiry__fields">
      {error ? (
        <p className="luxury-field__error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="luxury-field">
        <label htmlFor="luxury-inquiry-name" className="luxury-field__label">
          {dict.inquiry.name}
        </label>
        <input
          id="luxury-inquiry-name"
          name="name"
          required
          autoComplete="name"
          className="luxury-field__control"
        />
      </div>
      <div className="luxury-field">
        <label htmlFor="luxury-inquiry-phone" className="luxury-field__label">
          {dict.inquiry.phone}
        </label>
        <input
          id="luxury-inquiry-phone"
          name="phone"
          inputMode="numeric"
          required
          autoComplete="tel"
          value={phone}
          onChange={onPhoneChange}
          className="luxury-field__control"
        />
      </div>
      <div className="luxury-field">
        <label htmlFor="luxury-inquiry-message" className="luxury-field__label">
          {dict.inquiry.message}
        </label>
        <textarea
          id="luxury-inquiry-message"
          name="message"
          required
          className="luxury-field__control luxury-field__control--area"
          placeholder={
            isSale
              ? dict.inquiry.placeholderSale
              : dict.inquiry.placeholderRent
          }
        />
      </div>
      <LuxuryButton type="submit" variant="gold" fullWidth loading={pending}>
        {pending ? dict.inquiry.sending : dict.inquiry.send}
      </LuxuryButton>
    </form>
  );
}
