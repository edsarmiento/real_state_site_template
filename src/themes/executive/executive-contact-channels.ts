import type { PublicSiteContent } from "@/lib/public-site-content";
import { publicContactChannels, type PublicContactChannels } from "@/lib/public-contact-channels";

function absentToNull(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Preserve Executive's whitespace normalization before shared channel resolution. */
export function executiveContactChannels(
  content: PublicSiteContent,
): PublicContactChannels {
  return publicContactChannels({
    ...content,
    whatsapp: {
      ...content.whatsapp,
      number: absentToNull(content.whatsapp.number),
      href: absentToNull(content.whatsapp.href),
    },
    contact: {
      ...content.contact,
      whatsappNumber: absentToNull(content.contact.whatsappNumber),
      whatsappHref: absentToNull(content.contact.whatsappHref),
      phone: absentToNull(content.contact.phone),
      phoneHref: absentToNull(content.contact.phoneHref),
    },
  });
}
