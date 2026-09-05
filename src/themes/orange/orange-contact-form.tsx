"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { buildWhatsAppHref } from "@/lib/public-site-content";
import type { SiteDictionary } from "@/lib/site-i18n";
import type { OrangeCopy } from "@/themes/orange/orange-copy";
import { OrangeToast } from "@/themes/orange/orange-toast";

type Props = {
  dict: SiteDictionary;
  copy: OrangeCopy;
  whatsappNumber: string | null;
  email: string | null;
  privacyHref: string;
  unavailableNote: string;
};

function buildMessage(
  data: FormData,
  dict: SiteDictionary,
  copy: OrangeCopy,
): string {
  const interest = String(data.get("interest") || "");
  const lines = [
    `${dict.contact.name}: ${String(data.get("name") || "").trim()}`,
    `${dict.contact.phone}: ${String(data.get("phone") || "").trim()}`,
  ];
  const email = String(data.get("email") || "").trim();
  if (email) lines.push(`${dict.contact.emailLabel}: ${email}`);
  if (interest) lines.push(`${copy.formInterest}: ${interest}`);
  const message = String(data.get("message") || "").trim();
  if (message) lines.push(`${dict.contact.message}: ${message}`);
  return lines.join("\n");
}

export function OrangeContactForm({
  dict,
  copy,
  whatsappNumber,
  email,
  privacyHref,
  unavailableNote,
}: Props) {
  const fieldId = useId();
  const [status, setStatus] = useState({ message: "", token: 0 });
  const channel = whatsappNumber ? "whatsapp" : email ? "email" : "none";

  function announce(message: string) {
    setStatus((prev) => ({ message, token: prev.token + 1 }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = buildMessage(data, dict, copy);

    if (whatsappNumber) {
      window.open(
        buildWhatsAppHref(whatsappNumber, body),
        "_blank",
        "noopener,noreferrer",
      );
      announce(copy.formOpenedWhatsApp);
      return;
    }
    if (email) {
      const subject = encodeURIComponent(copy.formEmailSubject);
      window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(body)}`;
      announce(copy.formOpenedEmail);
    }
  }

  return (
    <form className="orange-form" onSubmit={onSubmit}>
      <p className="orange-form__intro">{copy.formIntro}</p>

      <div className="orange-form__row">
        <label className="orange-field" htmlFor={`${fieldId}-name`}>
          <span>{dict.contact.name}</span>
          <input
            id={`${fieldId}-name`}
            name="name"
            required
            autoComplete="name"
            placeholder={dict.contact.namePlaceholder}
          />
        </label>
        <label className="orange-field" htmlFor={`${fieldId}-email`}>
          <span>
            {dict.contact.emailLabel}
            {channel === "email" ? "" : ` (${dict.contact.emailOptional})`}
          </span>
          <input
            id={`${fieldId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={dict.contact.emailPlaceholder}
          />
        </label>
      </div>

      <div className="orange-form__row">
        <label className="orange-field" htmlFor={`${fieldId}-phone`}>
          <span>{dict.contact.phone}</span>
          <input
            id={`${fieldId}-phone`}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder={dict.contact.phonePlaceholder}
          />
        </label>
        <label className="orange-field" htmlFor={`${fieldId}-interest`}>
          <span>{copy.formInterest}</span>
          <select id={`${fieldId}-interest`} name="interest" defaultValue="">
            <option value={dict.contact.buy}>{dict.contact.buy}</option>
            <option value={dict.contact.rent}>{dict.contact.rent}</option>
            <option value={copy.formInterestOther}>
              {copy.formInterestOther}
            </option>
          </select>
        </label>
      </div>

      <label className="orange-field" htmlFor={`${fieldId}-message`}>
        <span>{dict.contact.message}</span>
        <textarea
          id={`${fieldId}-message`}
          name="message"
          rows={4}
          required
          placeholder={dict.contact.messagePlaceholder}
        />
      </label>

      <div className="orange-check">
        <input id={`${fieldId}-privacy`} type="checkbox" required />
        <label htmlFor={`${fieldId}-privacy`}>
          {dict.contact.privacyConsent}{" "}
          <Link href={privacyHref} className="orange-inline-link">
            {dict.contact.privacyLink}
          </Link>
        </label>
      </div>

      <div className="orange-form__submit">
        <button
          type="submit"
          className="orange-btn orange-btn--dark"
          disabled={channel === "none"}
          aria-describedby={channel === "none" ? `${fieldId}-note` : undefined}
        >
          {copy.formSubmit}
        </button>
      </div>

      {channel === "none" ? (
        <p id={`${fieldId}-note`} className="orange-form__note">
          {unavailableNote}
        </p>
      ) : null}

      <OrangeToast message={status.message} token={status.token} />
    </form>
  );
}
