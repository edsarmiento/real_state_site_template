import type {
  ContactContent,
  ContactFormCopy,
  LegalContent,
} from "@/lib/public-site-content";
import {
  localizeSiteHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import type { ExecutiveCopy } from "@/themes/executive/executive-copy";
import { ExecutiveIconWhatsApp } from "@/themes/executive/executive-icons";

type Props = {
  contact: ContactContent;
  contactForm: ContactFormCopy;
  legal: LegalContent;
  dict: SiteDictionary;
  copy: ExecutiveCopy;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  whatsappHref: string | null;
};

/**
 * Catalog contact panel. Site content currently types formEnabled as false and
 * formMode as hidden|preview only — ListingInquiryForm needs a listing slug and
 * lives on the listing detail. Preview mode shows a non-submitting shell using
 * shared contactForm copy and LegalContent.privacyConsentLabel.
 */
export function ExecutiveContactForm({
  contact,
  contactForm,
  legal,
  dict,
  copy,
  locale,
  defaultLocale,
  whatsappHref,
}: Props) {
  const privacyHref = localizeSiteHref(
    legal.privacyNoticeUrl,
    locale,
    defaultLocale,
  );
  const title = contactForm.title || dict.contact.formTitle;
  const eyebrow = contactForm.eyebrow || dict.contact.formEyebrow;
  const description =
    contactForm.description || dict.contact.formDescription;

  if (contact.formMode === "hidden") {
    return (
      <aside className="executive-consult" aria-label={eyebrow}>
        <p className="executive-kicker">{eyebrow}</p>
        <h3>{title}</h3>
        <p>{dict.contact.formUnavailable}</p>
        <WhatsAppBlock
          whatsappHref={whatsappHref}
          copy={copy}
          opensInNewTab={dict.a11y.opensInNewTab}
          attentionNote={contact.attentionNote}
        />
      </aside>
    );
  }

  return (
    <form
      className="executive-consult executive-consult--preview"
      noValidate
      aria-label={dict.contact.previewAria}
    >
      <p className="executive-kicker">{eyebrow}</p>
      <p className="executive-consult__badge">{dict.contact.previewBadge}</p>
      <h3>{title}</h3>
      <p>{description}</p>

      <label className="executive-search__field">
        <span className="executive-search__label">{dict.contact.name}</span>
        <input
          name="name"
          className="executive-field"
          autoComplete="name"
          placeholder={dict.contact.namePlaceholder}
          disabled
        />
      </label>
      <label className="executive-search__field">
        <span className="executive-search__label">{dict.contact.phone}</span>
        <input
          name="phone"
          className="executive-field"
          inputMode="tel"
          autoComplete="tel"
          placeholder={dict.contact.phonePlaceholder}
          disabled
        />
      </label>
      <label className="executive-search__field">
        <span className="executive-search__label">
          {dict.contact.emailLabel}{" "}
          <span className="executive-consult__optional">
            {dict.contact.emailOptional}
          </span>
        </span>
        <input
          name="email"
          type="email"
          className="executive-field"
          autoComplete="email"
          placeholder={dict.contact.emailPlaceholder}
          disabled
        />
      </label>
      <label className="executive-search__field">
        <span className="executive-search__label">{dict.contact.message}</span>
        <textarea
          name="message"
          className="executive-field"
          rows={4}
          placeholder={dict.contact.messagePlaceholder}
          disabled
        />
      </label>

      <label className="executive-consult__consent">
        <input type="checkbox" name="privacyAccepted" disabled />
        <span>
          {legal.privacyConsentLabel}{" "}
          <a href={privacyHref} className="executive-inline-link">
            {dict.contact.privacyLink}
          </a>
        </span>
      </label>

      <button type="submit" className="executive-search__submit" disabled>
        {dict.contact.submit}
      </button>
      <p className="executive-consult__note" role="status">
        {contactForm.previewNote || dict.contact.previewNote}
      </p>

      <WhatsAppBlock
        whatsappHref={whatsappHref}
        copy={copy}
        opensInNewTab={dict.a11y.opensInNewTab}
        attentionNote={contact.attentionNote}
        prompt={contactForm.immediatePrompt || copy.immediatePrompt}
      />
    </form>
  );
}

function WhatsAppBlock({
  whatsappHref,
  copy,
  opensInNewTab,
  attentionNote,
  prompt,
}: {
  whatsappHref: string | null;
  copy: ExecutiveCopy;
  opensInNewTab: string;
  attentionNote: string | null;
  prompt?: string;
}) {
  const href = whatsappHref?.trim() || null;
  if (href) {
    return (
      <div className="executive-consult__wa">
        <p>{prompt || copy.immediatePrompt}</p>
        <a
          href={href}
          className="executive-whatsapp-cta executive-whatsapp-cta--block"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${copy.openWhatsApp}. ${opensInNewTab}`}
        >
          <ExecutiveIconWhatsApp className="executive-whatsapp-cta__icon" />
          {copy.openWhatsApp}
        </a>
      </div>
    );
  }
  if (attentionNote) {
    return <p className="executive-consult__note">{attentionNote}</p>;
  }
  return null;
}
