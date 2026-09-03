"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  parseApiFailureMessage,
  parseOfferType,
  type ListingOfferType,
} from "@/lib/listing-types";
import { localizeSiteHref, type SiteDictionary, type SiteLocale } from "@/lib/site-i18n";

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

const inputClass = "beige-field";

export function BeigeInquiryForm({
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
      <p className="text-sm text-[#8F9F81]" role="status">
        {dict.inquiry.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div>
        <label htmlFor="beige-inquiry-name" className="mb-1 block text-xs uppercase tracking-wider text-[#A39073]">
          {dict.inquiry.name}
        </label>
        <input
          id="beige-inquiry-name"
          name="name"
          required
          autoComplete="name"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="beige-inquiry-phone" className="mb-1 block text-xs uppercase tracking-wider text-[#A39073]">
          {dict.inquiry.phone}
        </label>
        <input
          id="beige-inquiry-phone"
          name="phone"
          inputMode="numeric"
          required
          autoComplete="tel"
          value={phone}
          onChange={onPhoneChange}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="beige-inquiry-message" className="mb-1 block text-xs uppercase tracking-wider text-[#A39073]">
          {dict.inquiry.message}
        </label>
        <textarea
          id="beige-inquiry-message"
          name="message"
          required
          rows={4}
          className={inputClass}
          placeholder={
            isSale
              ? dict.inquiry.placeholderSale
              : dict.inquiry.placeholderRent
          }
        />
      </div>
      <label className="flex items-start gap-2 text-xs leading-relaxed text-[#8A7759]">
        <input type="checkbox" name="privacyAccepted" required className="mt-0.5" />
        <span>
          {dict.contact.privacyConsent}{" "}
          <a href={privacyUrl} className="underline underline-offset-2">
            {dict.contact.privacyLink}
          </a>
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="beige-btn w-full rounded-2xl bg-[#A4B494] px-4 py-3.5 text-sm font-medium text-[#2D2A26] disabled:opacity-60"
      >
        {pending ? dict.inquiry.sending : dict.inquiry.send}
      </button>
    </form>
  );
}
