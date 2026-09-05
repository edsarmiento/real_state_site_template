"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  parseApiFailureMessage,
  parseOfferType,
  type ListingOfferType,
} from "@/lib/listing-types";
import {
  localizeSiteHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";

type Props = {
  slug: string;
  offerType?: ListingOfferType | string | null;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  privacyHref: string;
};

const PHONE_DIGITS = /^\d{10}$/;

function onlyPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function OrangeInquiryForm({
  slug,
  offerType,
  dict,
  locale,
  defaultLocale,
  privacyHref,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState("");
  const isSale = parseOfferType(offerType) === "sale";
  const privacyUrl = localizeSiteHref(privacyHref, locale, defaultLocale);

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
    if (!fd.get("privacyAccepted")) {
      setError(dict.contact.privacyConsent);
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
      <p className="orange-success" role="status">
        {dict.inquiry.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="orange-inquiry">
      {error ? (
        <p className="orange-error" role="alert">
          {error}
        </p>
      ) : null}
      <label className="orange-field">
        <span>{dict.inquiry.name}</span>
        <input name="name" required autoComplete="name" />
      </label>
      <label className="orange-field">
        <span>{dict.inquiry.phone}</span>
        <input
          name="phone"
          inputMode="numeric"
          required
          autoComplete="tel"
          value={phone}
          onChange={onPhoneChange}
        />
      </label>
      <label className="orange-field">
        <span>{dict.inquiry.message}</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder={
            isSale ? dict.inquiry.placeholderSale : dict.inquiry.placeholderRent
          }
        />
      </label>
      <label className="orange-check">
        <input type="checkbox" name="privacyAccepted" required />
        <span>
          {dict.contact.privacyConsent}{" "}
          <a href={privacyUrl} className="orange-inline-link">
            {dict.contact.privacyLink}
          </a>
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="orange-btn orange-btn--dark orange-btn--full"
      >
        {pending
          ? dict.inquiry.sending
          : isSale
            ? dict.listing.inquireSale
            : dict.listing.inquireRent}
      </button>
    </form>
  );
}
