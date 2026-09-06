import type { PublicSiteContent } from "@/lib/public-site-content";

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
  return {
    whatsappNumber: content.whatsapp.number ?? content.contact.whatsappNumber,
    whatsappHref: content.whatsapp.href ?? content.contact.whatsappHref,
    phone: content.contact.phone,
    phoneHref: content.contact.phoneHref,
  };
}
