"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { parseApiFailureMessage } from "@/lib/listing-types";
import type { LegalContent } from "@/lib/public-site-content";
import {
  localizeSiteHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { getBeigeCopy } from "@/themes/beige/beige-copy";

type Props = {
  listingSlug: string | null;
  legal: LegalContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

const PHONE_DIGITS = /^\d{10}$/;

function onlyPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

const field =
  "beige-field mt-1";

export function BeigeContactForm({
  listingSlug,
  legal,
  dict,
  locale,
  defaultLocale,
}: Props) {
  const copy = getBeigeCopy(locale);
  const privacyHref = localizeSiteHref(
    legal.privacyNoticeUrl,
    locale,
    defaultLocale,
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState("");

  function onPhoneChange(event: ChangeEvent<HTMLInputElement>) {
    setPhone(onlyPhoneDigits(event.target.value));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const phoneDigits = onlyPhoneDigits(String(fd.get("phone") || phone));
    if (!PHONE_DIGITS.test(phoneDigits)) {
      setError(dict.inquiry.phoneError);
      return;
    }
    if (!fd.get("privacyAccepted")) {
      setError(dict.contact.privacyConsent);
      return;
    }
    if (!listingSlug) {
      setError(copy.contactNeedsListing);
      return;
    }

    setError(null);
    setPending(true);
    try {
      const message = String(fd.get("message") || "").trim();
      const res = await fetch(
        `/api/public/listings/${encodeURIComponent(listingSlug)}/inquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inquiry: {
              name: String(fd.get("name") || "").trim(),
              phone: phoneDigits,
              message: message
                ? `${copy.generalInquiryPrefix}\n\n${message}`
                : copy.generalInquiryPrefix,
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
      form.reset();
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <p className="p-8 text-sm text-[#8F9F81]" role="status">
        {dict.inquiry.success}
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={onSubmit}
      noValidate
      aria-busy={pending}
    >
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#A39073]">
        {dict.contact.name}
        <input
          name="name"
          required
          autoComplete="name"
          className={field}
          placeholder={dict.contact.namePlaceholder}
        />
      </label>
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#A39073]">
        {dict.contact.phone}
        <input
          name="phone"
          inputMode="numeric"
          required
          autoComplete="tel"
          value={phone}
          onChange={onPhoneChange}
          className={field}
          placeholder={dict.contact.phonePlaceholder}
        />
      </label>
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#A39073]">
        {dict.contact.message}
        <textarea
          name="message"
          required
          rows={4}
          className={field}
          placeholder={dict.contact.messagePlaceholder}
        />
      </label>
      <label className="flex items-start gap-2 text-xs leading-relaxed text-[#8A7759]">
        <input
          type="checkbox"
          name="privacyAccepted"
          required
          className="mt-0.5"
        />
        <span>
          {dict.contact.privacyConsent}{" "}
          <a href={privacyHref} className="underline underline-offset-2">
            {dict.contact.privacyLink}
          </a>
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="beige-btn w-full rounded-2xl bg-[#2D2A26] px-4 py-3.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? dict.inquiry.sending : copy.contactSubmit}
      </button>
    </form>
  );
}
