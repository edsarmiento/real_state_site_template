import type { PublicSiteContent } from "@/lib/public-site-content";
import { isExamplePhone } from "@/lib/example-contact";

export type ExecutiveContactChannels = {
  whatsappHref: string | null;
  phoneHref: string | null;
  whatsappNumber: string | null;
  phone: string | null;
};

function absentToNull(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function executiveContactChannels(
  content: PublicSiteContent,
): ExecutiveContactChannels {
  const phone = absentToNull(content.contact.phone);
  const hidePhone = isExamplePhone(phone);
  return {
    whatsappNumber:
      absentToNull(content.whatsapp.number) ??
      absentToNull(content.contact.whatsappNumber),
    whatsappHref:
      absentToNull(content.whatsapp.href) ??
      absentToNull(content.contact.whatsappHref),
    phone: hidePhone ? null : phone,
    phoneHref: hidePhone ? null : absentToNull(content.contact.phoneHref),
  };
}
