import type { PublicSiteContent } from "@/lib/public-site-content";

export type ElegantContactChannels = {
  whatsappHref: string | null;
  phoneHref: string | null;
  whatsappNumber: string | null;
  phone: string | null;
};

export function elegantContactChannels(
  content: PublicSiteContent,
): ElegantContactChannels {
  return {
    whatsappNumber: content.whatsapp.number ?? content.contact.whatsappNumber,
    whatsappHref: content.whatsapp.href ?? content.contact.whatsappHref,
    phone: content.contact.phone,
    phoneHref: content.contact.phoneHref,
  };
}
