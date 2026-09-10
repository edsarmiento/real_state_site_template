import type { PublicSiteContent } from "@/lib/public-site-content";

export type UltraContactChannels = {
  whatsappHref: string | null;
  phoneHref: string | null;
  whatsappNumber: string | null;
  phone: string | null;
};

/** Institutional contact from getPublicSiteContent(), never listing phones. */
export function ultraContactChannels(
  content: PublicSiteContent,
): UltraContactChannels {
  return {
    whatsappNumber: content.whatsapp.number ?? content.contact.whatsappNumber,
    whatsappHref: content.whatsapp.href ?? content.contact.whatsappHref,
    phone: content.contact.phone,
    phoneHref: content.contact.phoneHref,
  };
}
