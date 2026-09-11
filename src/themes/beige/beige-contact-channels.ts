import type { PublicSiteContent } from "@/lib/public-site-content";
import { isExamplePhone } from "@/lib/example-contact";

export type BeigeContactChannels = {
  whatsappHref: string | null;
  phoneHref: string | null;
  whatsappNumber: string | null;
  phone: string | null;
};

/**
 * Institutional contact only, from getPublicSiteContent():
 * SITE_WHATSAPP_NUMBER, SITE_CONTACT_PHONE.
 * Social and email are read from SITE_FACEBOOK_URL, SITE_INSTAGRAM_URL,
 * SITE_CONTACT_EMAIL in public-site-content — not from listing contact_phone.
 */
export function beigeContactChannels(
  content: PublicSiteContent,
): BeigeContactChannels {
  const phone = content.contact.phone;
  const hidePhone = isExamplePhone(phone);
  return {
    whatsappNumber: content.whatsapp.number ?? content.contact.whatsappNumber,
    whatsappHref: content.whatsapp.href ?? content.contact.whatsappHref,
    phone: hidePhone ? null : phone,
    phoneHref: hidePhone ? null : content.contact.phoneHref,
  };
}
