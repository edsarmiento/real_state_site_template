import type { PublicSiteContent } from "@/lib/public-site-content";

export type BeigeContactChannels = {
  whatsappHref: string | null;
  phoneHref: string | null;
  whatsappNumber: string | null;
  phone: string | null;
};

/**
 * Institutional contact only: SiteConfig / public site content, which already
 * falls back to SITE_WHATSAPP_NUMBER and SITE_CONTACT_PHONE.
 * Listing `contact_phone` must not be used here.
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
