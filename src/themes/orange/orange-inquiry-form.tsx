"use client";

import { parseOfferType, type ListingOfferType } from "@/lib/listing-types";
import { useListingInquiry } from "@/lib/listing-inquiry";
import {
  localizeSiteHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";

type Props = {
  slug: string;
  offerType?: ListingOfferType | string | null;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  privacyHref: string;
};

export function OrangeInquiryForm({
  slug,
  offerType,
  dict,
  locale,
  defaultLocale,
  privacyHref,
}: Props) {
  const { error, pending, sent, phone, onPhoneChange, onSubmit } =
    useListingInquiry(slug, dict.inquiry, {
      privacyRequired: true,
      privacyError: dict.contact.privacyConsent,
    });
  const isSale = parseOfferType(offerType) === "sale";
  const privacyUrl = localizeSiteHref(privacyHref, locale, defaultLocale);

  if (sent) {
    return (
      <p className="orange-success" role="status">
        {dict.inquiry.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="orange-inquiry">
      {error ? (
        <p className="orange-error" role="alert">
          {error}
        </p>
      ) : null}
      <label className="orange-field">
        <span>{dict.inquiry.name}</span>
        <input name="name" required autoComplete="name" />
      </label>
      <label className="orange-field">
        <span>{dict.inquiry.phone}</span>
        <input
          name="phone"
          inputMode="numeric"
          required
          autoComplete="tel"
          value={phone}
          onChange={onPhoneChange}
        />
      </label>
      <label className="orange-field">
        <span>{dict.inquiry.message}</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder={
            isSale ? dict.inquiry.placeholderSale : dict.inquiry.placeholderRent
          }
        />
      </label>
      <label className="orange-check">
        <input type="checkbox" name="privacyAccepted" value="on" required />
        <span>
          {dict.contact.privacyConsent}{" "}
          <a href={privacyUrl} className="orange-inline-link">
            {dict.contact.privacyLink}
          </a>
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="orange-btn orange-btn--dark orange-btn--full"
      >
        {pending
          ? dict.inquiry.sending
          : isSale
            ? dict.listing.inquireSale
            : dict.listing.inquireRent}
      </button>
    </form>
  );
}
