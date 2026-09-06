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

export function BeigeContactForm({
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
      <aside className="beige-form-panel" aria-label={dict.contact.kicker}>
        <p className="beige-form-panel__eyebrow">{dict.contact.formEyebrow}</p>
        <h3 className="beige-form-panel__title">{dict.contact.formTitle}</h3>
        <p className="beige-form-panel__lead">{dict.contact.formUnavailable}</p>
      </aside>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      className="beige-form-panel beige-form-panel--preview"
      onSubmit={onSubmit}
      noValidate
      aria-label={dict.contact.previewAria}
    >
      <div className="beige-form-panel__head">
        <div className="beige-form-panel__meta">
          <p className="beige-form-panel__eyebrow">{dict.contact.formEyebrow}</p>
          <p className="beige-form-panel__status">{dict.contact.previewBadge}</p>
        </div>
        <h3 className="beige-form-panel__title">{dict.contact.formTitle}</h3>
        <p className="beige-form-panel__lead">{dict.contact.formDescription}</p>
      </div>

      <div className="beige-form-row">
        <label className="beige-form-field">
          {dict.contact.name}
          <input
            name="name"
            className="beige-field"
            autoComplete="name"
            placeholder={dict.contact.namePlaceholder}
            disabled
          />
        </label>
        <label className="beige-form-field">
          {dict.contact.phone}
          <input
            name="phone"
            className="beige-field"
            inputMode="tel"
            autoComplete="tel"
            placeholder={dict.contact.phonePlaceholder}
            disabled
          />
        </label>
      </div>

      <div className="beige-form-row">
        <label className="beige-form-field">
          {dict.contact.emailLabel}{" "}
          <span className="beige-form-optional">{dict.contact.emailOptional}</span>
          <input
            name="email"
            type="email"
            className="beige-field"
            autoComplete="email"
            placeholder={dict.contact.emailPlaceholder}
            disabled
          />
        </label>
        <fieldset className="beige-form-field" disabled>
          <legend>{dict.contact.operation}</legend>
          <div className="beige-form-pills">
            <label className="beige-form-pill">
              <input type="radio" name="operation" value="sale" defaultChecked disabled />
              {dict.contact.buy}
            </label>
            <label className="beige-form-pill">
              <input type="radio" name="operation" value="rent" disabled />
              {dict.contact.rent}
            </label>
          </div>
        </fieldset>
      </div>

      <label className="beige-form-field">
        {dict.contact.locationInterest}
        <input
          name="location"
          className="beige-field"
          placeholder={dict.contact.locationPlaceholder}
          disabled
        />
      </label>

      <label className="beige-form-field">
        {dict.contact.message}
        <textarea
          name="message"
          className="beige-field beige-field--area"
          rows={4}
          placeholder={dict.contact.messagePlaceholder}
          disabled
        />
      </label>

      <label className="beige-form-consent">
        <input type="checkbox" name="privacyAccepted" disabled />
        <span>
          {dict.contact.privacyConsent}{" "}
          <a href={privacyHref} className="beige-inline-link">
            {dict.contact.privacyLink}
          </a>
        </span>
      </label>

      <button type="submit" className="beige-btn beige-form-submit" disabled>
        {dict.contact.submit}
      </button>
      <p className="beige-form-hint" role="status">
        {dict.contact.previewNote}
      </p>
      {contact.whatsappHref ? (
        <div className="beige-form-alt">
          <p>{dict.contact.immediatePrompt}</p>
          <a
            href={contact.whatsappHref}
            className="beige-btn"
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
