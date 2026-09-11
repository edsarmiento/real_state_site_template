import type { PublicSiteContent } from "@/lib/public-site-content";
import { isExamplePhone } from "@/lib/example-contact";

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
  const phone = content.contact.phone;
  const hidePhone = isExamplePhone(phone);
  return {
    whatsappNumber: content.whatsapp.number ?? content.contact.whatsappNumber,
    whatsappHref: content.whatsapp.href ?? content.contact.whatsappHref,
    phone: hidePhone ? null : phone,
    phoneHref: hidePhone ? null : content.contact.phoneHref,
  };
}
