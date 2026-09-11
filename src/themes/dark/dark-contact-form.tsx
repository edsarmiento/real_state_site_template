"use client";

import type { FormEvent } from "react";
import type { ContactContent, LegalContent } from "@/lib/public-site-content";
import {
  localizeSiteHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";

type Props = {
  contact: ContactContent;
  legal: LegalContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function DarkContactForm({
  contact,
  legal,
  dict,
  locale,
  defaultLocale,
}: Props) {
  const privacyHref = localizeSiteHref(
    legal.privacyNoticeUrl,
    locale,
    defaultLocale,
  );

  if (contact.formMode === "hidden") {
    return (
      <aside className="dark-form-panel" aria-label={dict.contact.kicker}>
        <p className="dark-form-panel__eyebrow">{dict.contact.formEyebrow}</p>
        <h3 className="dark-form-panel__title">{dict.contact.formTitle}</h3>
        <p className="dark-form-panel__lead">{dict.contact.formUnavailable}</p>
      </aside>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      className="dark-form-panel dark-form-panel--preview"
      onSubmit={onSubmit}
      noValidate
      aria-label={dict.contact.previewAria}
    >
      <div className="dark-form-panel__head">
        <div className="dark-form-panel__meta">
          <p className="dark-form-panel__eyebrow">{dict.contact.formEyebrow}</p>
          <p className="dark-form-panel__status">{dict.contact.previewBadge}</p>
        </div>
        <h3 className="dark-form-panel__title">{dict.contact.formTitle}</h3>
        <p className="dark-form-panel__lead">{dict.contact.formDescription}</p>
      </div>

      <div className="dark-form-row">
        <label className="dark-form-field">
          {dict.contact.name}
          <input
            name="name"
            className="dark-field"
            autoComplete="name"
            placeholder={dict.contact.namePlaceholder}
            disabled
          />
        </label>
        <label className="dark-form-field">
          {dict.contact.phone}
          <input
            name="phone"
            className="dark-field"
            inputMode="tel"
            autoComplete="tel"
            placeholder={dict.contact.phonePlaceholder}
            disabled
          />
        </label>
      </div>

      <label className="dark-form-field">
        {dict.contact.emailLabel}{" "}
        <span className="dark-form-optional">{dict.contact.emailOptional}</span>
        <input
          name="email"
          type="email"
          className="dark-field"
          autoComplete="email"
          placeholder={dict.contact.emailPlaceholder}
          disabled
        />
      </label>

      <label className="dark-form-field">
        {dict.contact.message}
        <textarea
          name="message"
          className="dark-field dark-field--area"
          rows={4}
          placeholder={dict.contact.messagePlaceholder}
          disabled
        />
      </label>

      <label className="dark-form-consent">
        <input type="checkbox" name="privacyAccepted" disabled />
        <span>
          {dict.contact.privacyConsent}{" "}
          <a href={privacyHref} className="dark-inline-link">
            {dict.contact.privacyLink}
          </a>
        </span>
      </label>

      <button type="submit" className="dark-btn dark-form-submit" disabled>
        {dict.contact.submit}
      </button>
      <p className="dark-form-hint" role="status">
        {dict.contact.previewNote}
      </p>
      {contact.whatsappHref ? (
        <div className="dark-form-alt">
          <p>{dict.contact.immediatePrompt}</p>
          <a
            href={contact.whatsappHref}
            className="dark-btn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
          >
            {dict.whatsapp.label}
          </a>
        </div>
      ) : null}
    </form>
  );
}
