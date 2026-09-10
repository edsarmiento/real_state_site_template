import type { PublicSiteContent } from "@/lib/public-site-content";

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
  return {
    whatsappNumber: absentToNull(
      content.whatsapp.number ?? content.contact.whatsappNumber,
    ),
    whatsappHref: absentToNull(
      content.whatsapp.href ?? content.contact.whatsappHref,
    ),
    phone: absentToNull(content.contact.phone),
    phoneHref: absentToNull(content.contact.phoneHref),
  };
}
