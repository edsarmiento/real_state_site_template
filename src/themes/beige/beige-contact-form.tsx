"use client";

import type { FormEvent } from "react";
import type { ContactContent, LegalContent } from "@/lib/public-site-content";
import {
  localizeSiteHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { BeigeIconWhatsApp } from "@/themes/beige/beige-icons";

type Props = {
  contact: ContactContent;
  legal: LegalContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

const field =
  "w-full border border-[#E5D9C5] bg-[#FBF9F5] px-3 py-2 text-sm text-[#2D2A26] disabled:opacity-70";

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
      <aside
        className="rounded-2xl border border-[#E5D9C5] bg-[#F4EFE6] p-6"
        aria-label={dict.contact.kicker}
      >
        <p className="text-xs uppercase tracking-wider text-[#A39073]">
          {dict.contact.formEyebrow}
        </p>
        <h3 className="beige-serif mt-2 text-2xl">{dict.contact.formTitle}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#8A7759]">
          {dict.contact.formUnavailable}
        </p>
      </aside>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      className="rounded-2xl border border-[#E5D9C5] bg-[#FBF9F5] p-6"
      onSubmit={onSubmit}
      noValidate
      aria-label={dict.contact.previewAria}
    >
      <p className="text-xs uppercase tracking-wider text-[#A39073]">
        {dict.contact.formEyebrow}
      </p>
      <p className="mt-1 text-xs font-semibold text-[#8F9F81]">
        {dict.contact.previewBadge}
      </p>
      <h3 className="beige-serif mt-2 text-2xl">{dict.contact.formTitle}</h3>
      <p className="mt-2 text-sm text-[#8A7759]">{dict.contact.formDescription}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-xs uppercase tracking-wider text-[#A39073]">
          {dict.contact.name}
          <input
            name="name"
            className={`${field} mt-1`}
            placeholder={dict.contact.namePlaceholder}
            disabled
          />
        </label>
        <label className="text-xs uppercase tracking-wider text-[#A39073]">
          {dict.contact.phone}
          <input
            name="phone"
            className={`${field} mt-1`}
            placeholder={dict.contact.phonePlaceholder}
            disabled
          />
        </label>
        <label className="text-xs uppercase tracking-wider text-[#A39073] sm:col-span-2">
          {dict.contact.message}
          <textarea
            name="message"
            rows={4}
            className={`${field} mt-1`}
            placeholder={dict.contact.messagePlaceholder}
            disabled
          />
        </label>
      </div>

      <label className="mt-4 flex items-start gap-2 text-xs text-[#8A7759]">
        <input type="checkbox" name="privacyAccepted" disabled className="mt-0.5" />
        <span>
          {dict.contact.privacyConsent}{" "}
          <a href={privacyHref} className="underline underline-offset-2">
            {dict.contact.privacyLink}
          </a>
        </span>
      </label>

      <button
        type="submit"
        disabled
        className="mt-4 w-full rounded-xl bg-[#E5D9C5] px-4 py-3 text-sm font-semibold text-[#8A7759]"
      >
        {dict.contact.submit}
      </button>
      <p className="mt-3 text-sm text-[#A39073]" role="status">
        {dict.contact.previewNote}
      </p>
      {contact.whatsappHref ? (
        <a
          href={contact.whatsappHref}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#8F9F81]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BeigeIconWhatsApp className="h-4 w-4" />
          {dict.whatsapp.label}
        </a>
      ) : null}
    </form>
  );
}
