import type { PublicSiteContent } from "@/lib/public-site-content";
import { isExamplePhone } from "@/lib/example-contact";

export type ElegantContactChannels = {
  whatsappHref: string | null;
  phoneHref: string | null;
  whatsappNumber: string | null;
  phone: string | null;
};

export function elegantContactChannels(
  content: PublicSiteContent,
): ElegantContactChannels {
  const phone = content.contact.phone;
  const hidePhone = isExamplePhone(phone);
  return {
    whatsappNumber: content.whatsapp.number ?? content.contact.whatsappNumber,
    whatsappHref: content.whatsapp.href ?? content.contact.whatsappHref,
    phone: hidePhone ? null : phone,
    phoneHref: hidePhone ? null : content.contact.phoneHref,
  };
}
