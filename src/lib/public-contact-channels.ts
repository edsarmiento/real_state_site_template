import type { SiteDictionary } from "@/lib/site-i18n";
import type { PublicSiteContent } from "@/lib/public-site-content";
import { isExampleEmail, isExamplePhone } from "@/lib/example-contact";

export type PublicContactChannels = {
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
export function publicContactChannels(
  content: PublicSiteContent,
): PublicContactChannels {
  const phone = content.contact.phone;
  const hidePhone = isExamplePhone(phone);
  return {
    whatsappNumber: content.whatsapp.number ?? content.contact.whatsappNumber,
    whatsappHref: content.whatsapp.href ?? content.contact.whatsappHref,
    phone: hidePhone ? null : phone,
    phoneHref: hidePhone ? null : content.contact.phoneHref,
  };
}

export type PublicContactChannel = {
  key: string;
  eyebrow: string;
  value: string;
  href: string | null;
  external?: boolean;
  icon: "whatsapp" | "phone" | "email" | "schedule" | "location";
};

export function collectPublicContactChannels(
  content: PublicSiteContent,
  dict: SiteDictionary,
): PublicContactChannel[] {
  const contact = content.contact;
  const { whatsappHref, phone, phoneHref } = publicContactChannels(content);
  const channels: PublicContactChannel[] = [];
  if (whatsappHref) {
    channels.push({
      key: "whatsapp",
      eyebrow: dict.contact.writeUs,
      value: dict.whatsapp.label,
      href: whatsappHref,
      external: true,
      icon: "whatsapp",
    });
  }
  if (phoneHref) {
    channels.push({
      key: "phone",
      eyebrow: dict.contact.callUs,
      value: phone || dict.contact.callUs,
      href: phoneHref,
      icon: "phone",
    });
  }
  if (contact.emailHref && contact.email && !isExampleEmail(contact.email)) {
    channels.push({
      key: "email",
      eyebrow: dict.contact.email,
      value: contact.email,
      href: contact.emailHref,
      icon: "email",
    });
  }
  if (contact.scheduleCallUrl) {
    channels.push({
      key: "schedule",
      eyebrow: dict.contact.schedule,
      value: dict.contact.scheduleValue,
      href: contact.scheduleCallUrl,
      external: true,
      icon: "schedule",
    });
  }
  if (contact.location) {
    channels.push({
      key: "location",
      eyebrow: dict.contact.location,
      value: contact.location,
      href: null,
      icon: "location",
    });
  }
  return channels;
}

