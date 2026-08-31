"use client";

import type { FormEvent } from "react";
import type { ContactContent, LegalContent } from "@/lib/public-site-content";
import {
  localizeSiteHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { LuxuryButton } from "@/themes/luxury/luxury-button";
import { LuxuryIntentSwitch } from "@/themes/luxury/luxury-intent-switch";
import { LuxuryWhatsAppLink } from "@/themes/luxury/luxury-whatsapp-link";

type Props = {
  contact: ContactContent;
  legal: LegalContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function LuxuryContactForm({
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
      <aside className="luxury-form-panel" aria-label={dict.contact.kicker}>
        <p className="luxury-form-panel__eyebrow">{dict.contact.formEyebrow}</p>
        <h3 className="luxury-form-panel__title">{dict.contact.formTitle}</h3>
        <p className="luxury-form-panel__lead">{dict.contact.formUnavailable}</p>
      </aside>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      className="luxury-form-panel luxury-form-panel--preview"
      onSubmit={onSubmit}
      noValidate
      aria-label={dict.contact.previewAria}
    >
      <div className="luxury-form-panel__head">
        <div className="luxury-form-panel__meta">
          <p className="luxury-form-panel__eyebrow">{dict.contact.formEyebrow}</p>
          <p className="luxury-form-panel__status">{dict.contact.previewBadge}</p>
        </div>
        <h3 className="luxury-form-panel__title">{dict.contact.formTitle}</h3>
        <p className="luxury-form-panel__lead">{dict.contact.formDescription}</p>
      </div>

      <div className="luxury-form-row luxury-form-row--2">
        <div className="luxury-field">
          <label htmlFor="contact-name" className="luxury-field__label">
            {dict.contact.name}
          </label>
          <input
            id="contact-name"
            name="name"
            className="luxury-field__control"
            autoComplete="name"
            placeholder={dict.contact.namePlaceholder}
            disabled
          />
        </div>
        <div className="luxury-field">
          <label htmlFor="contact-phone" className="luxury-field__label">
            {dict.contact.phone}
          </label>
          <input
            id="contact-phone"
            name="phone"
            className="luxury-field__control"
            inputMode="tel"
            autoComplete="tel"
            placeholder={dict.contact.phonePlaceholder}
            disabled
          />
        </div>
      </div>

      <div className="luxury-form-row luxury-form-row--2">
        <div className="luxury-field">
          <label htmlFor="contact-email" className="luxury-field__label">
            {dict.contact.emailLabel}{" "}
            <span className="luxury-field__optional">
              {dict.contact.emailOptional}
            </span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className="luxury-field__control"
            autoComplete="email"
            placeholder={dict.contact.emailPlaceholder}
            disabled
          />
        </div>
        <LuxuryIntentSwitch
          name="operation"
          legend={dict.contact.operation}
          label={dict.contact.operation}
          options={[
            { id: "sale", label: dict.contact.buy, value: "sale" },
            { id: "rent", label: dict.contact.rent, value: "rent" },
          ]}
          defaultValue="sale"
          disabled
        />
      </div>

      <div className="luxury-field">
        <label htmlFor="contact-location" className="luxury-field__label">
          {dict.contact.locationInterest}
        </label>
        <input
          id="contact-location"
          name="location"
          className="luxury-field__control"
          placeholder={dict.contact.locationPlaceholder}
          disabled
        />
      </div>

      <div className="luxury-field">
        <label htmlFor="contact-message" className="luxury-field__label">
          {dict.contact.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          className="luxury-field__control luxury-field__control--area"
          rows={4}
          placeholder={dict.contact.messagePlaceholder}
          disabled
        />
      </div>

      <label className="luxury-checkbox">
        <input type="checkbox" name="privacyAccepted" disabled />
        <span>
          {dict.contact.privacyConsent}{" "}
          <a href={privacyHref} className="luxury-inline-link">
            {dict.contact.privacyLink}
          </a>
        </span>
      </label>

      <div className="luxury-form-panel__actions">
        <LuxuryButton type="submit" variant="neutral" fullWidth disabled>
          {dict.contact.submit}
        </LuxuryButton>
        <p className="luxury-field__hint" role="status">
          {dict.contact.previewNote}
        </p>
        {contact.whatsappHref ? (
          <div className="luxury-form-panel__alt">
            <p className="luxury-form-panel__prompt">
              {dict.contact.immediatePrompt}
            </p>
            <LuxuryWhatsAppLink
              href={contact.whatsappHref}
              ariaLabel={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
            >
              {dict.whatsapp.label}
            </LuxuryWhatsAppLink>
          </div>
        ) : null}
      </div>
    </form>
  );
}