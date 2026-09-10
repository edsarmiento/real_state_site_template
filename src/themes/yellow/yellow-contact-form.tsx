import type { ContactContent, LegalContent } from "@/lib/public-site-content";
import {
  localizeSiteHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { YellowIconSend } from "@/themes/yellow/yellow-icons";

type Props = {
  contact: ContactContent;
  legal: LegalContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

/** Disabled preview surface (no active submit flow). Server Component. */
export function YellowContactForm({
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
      <aside className="yellow-form-panel" aria-label={dict.contact.kicker}>
        <p className="yellow-form-panel__eyebrow">{dict.contact.formEyebrow}</p>
        <h3 className="yellow-form-panel__title">{dict.contact.formTitle}</h3>
        <p className="yellow-form-panel__lead">{dict.contact.formUnavailable}</p>
        {contact.whatsappHref ? (
          <a
            href={contact.whatsappHref}
            className="yellow-btn yellow-btn--whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
          >
            {dict.whatsapp.label}
          </a>
        ) : null}
      </aside>
    );
  }

  return (
    <form
      className="yellow-form-panel yellow-form-panel--preview"
      noValidate
      aria-label={dict.contact.previewAria}
    >
      <div className="yellow-form-panel__head">
        <p className="yellow-form-panel__eyebrow">{dict.contact.formEyebrow}</p>
        <h3 className="yellow-form-panel__title">{dict.contact.formTitle}</h3>
        <p className="yellow-form-panel__status">{dict.contact.previewBadge}</p>
      </div>

      <div className="yellow-form-row">
        <label className="yellow-form-field">
          {dict.contact.name}
          <input
            name="name"
            className="yellow-field"
            autoComplete="name"
            placeholder={dict.contact.namePlaceholder}
            disabled
          />
        </label>
        <label className="yellow-form-field">
          {dict.contact.phone}
          <input
            name="phone"
            className="yellow-field"
            inputMode="tel"
            autoComplete="tel"
            placeholder={dict.contact.phonePlaceholder}
            disabled
          />
        </label>
      </div>

      <label className="yellow-form-field">
        {dict.contact.message}
        <textarea
          name="message"
          className="yellow-field yellow-field--area"
          rows={3}
          placeholder={dict.contact.messagePlaceholder}
          disabled
        />
      </label>

      <label className="yellow-form-consent">
        <input type="checkbox" name="privacyAccepted" disabled />
        <span>
          {dict.contact.privacyConsent}{" "}
          <a href={privacyHref} className="yellow-inline-link">
            {dict.contact.privacyLink}
          </a>
        </span>
      </label>

      <button type="submit" className="yellow-search__submit" disabled>
        <span>{dict.contact.submit}</span>
        <YellowIconSend className="h-3.5 w-3.5" />
      </button>
      <p className="yellow-form-hint" role="status">
        {dict.contact.previewNote}
      </p>
    </form>
  );
}
