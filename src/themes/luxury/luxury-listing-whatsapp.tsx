import {
  buildWhatsAppHref,
  parseWhatsAppNumber,
} from "@/lib/public-site-content";
import { fillTemplate, localizedHref, type SiteDictionary, type SiteLocale } from "@/lib/site-i18n";
import { siteOrigin } from "@/lib/site-config";
import { LuxuryIconWhatsApp } from "@/themes/luxury/luxury-icons";

type Props = {
  phone: string;
  title: string;
  slug: string;
  offerType?: "rent" | "sale";
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
};

export function LuxuryListingWhatsAppButton({
  phone,
  title,
  slug,
  offerType = "rent",
  locale,
  defaultLocale,
  dict,
}: Props) {
  const number = parseWhatsAppNumber(phone);
  if (!number) return null;

  const path = localizedHref(
    `/inmueble/${encodeURIComponent(slug)}`,
    locale,
    null,
    defaultLocale,
  );
  const url = new URL(path, siteOrigin()).href;
  const href = buildWhatsAppHref(
    number,
    fillTemplate(dict.inquiry.whatsappMessage, { title, url }),
  );
  const label =
    offerType === "sale" ? dict.inquiry.whatsappSale : dict.inquiry.whatsappRent;

  return (
    <a
      href={href}
      className="luxury-whatsapp-cta"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}. ${dict.a11y.opensInNewTab}`}
    >
      <LuxuryIconWhatsApp />
      {label}
    </a>
  );
}