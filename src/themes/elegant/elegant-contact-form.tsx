"use client";

import { ListingInquiryForm } from "@/components/listing-inquiry-form";
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
  inquirySlug: string | null;
};

export function ElegantContactForm({
  contact,
  legal,
  dict,
  locale,
  defaultLocale,
  inquirySlug,
}: Props) {
  const privacyHref = localizeSiteHref(
    legal.privacyNoticeUrl,
    locale,
    defaultLocale,
  );
  const privacy = {
    href: privacyHref,
    consentLabel: dict.contact.privacyConsent,
    linkLabel: dict.contact.privacyLink,
    error: dict.contact.privacyConsent,
  };

  if (!inquirySlug) {
    return (
      <aside className="elegant-form-panel" aria-label={dict.contact.kicker}>
        <p className="elegant-kicker">{dict.contact.formEyebrow}</p>
        <h3 className="elegant-form-panel__title">{dict.contact.formTitle}</h3>
        <p className="elegant-muted">{dict.contact.formUnavailable}</p>
        {contact.whatsappHref ? (
          <a
            href={contact.whatsappHref}
            className="elegant-btn elegant-btn--gold elegant-btn--full"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
          >
            {dict.whatsapp.label}
          </a>
        ) : (
          <p className="elegant-form-panel__privacy">
            <a href={privacyHref} className="elegant-inline-link">
              {dict.contact.privacyLink}
            </a>
          </p>
        )}
      </aside>
    );
  }

  return (
    <div className="elegant-form-panel">
      <p className="elegant-kicker">{dict.contact.formEyebrow}</p>
      <h3 className="elegant-form-panel__title">{dict.contact.formTitle}</h3>
      <p className="elegant-muted">{dict.contact.formDescription}</p>
      <ListingInquiryForm
        slug={inquirySlug}
        styledLayout={false}
        copy={{
          ...dict.inquiry,
          placeholderSale: dict.contact.messagePlaceholder,
          placeholderRent: dict.contact.messagePlaceholder,
        }}
        inputIdPrefix="elegant-contact"
        privacy={privacy}
        classNames={{
          form: "elegant-inquiry",
          label: "elegant-search__label",
          control: "elegant-field",
          textarea: "elegant-field",
          error: "elegant-inquiry__error",
          success: "elegant-inquiry__success",
          submit: "elegant-btn elegant-btn--gold elegant-btn--full",
          consent: "elegant-form-consent",
        }}
      />
    </div>
  );
}
