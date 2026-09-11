import { isExampleEmail, isExamplePhone } from "@/lib/example-contact";

export type ExecutiveFooterContact = {
  whatsappHref: string | null;
  phone: string | null;
  phoneHref: string | null;
  email: string | null;
  emailHref: string | null;
};

export type ExecutiveFooterContactChannel = {
  kind: "whatsapp" | "email" | "phone";
  href: string;
  label: string;
};

function absentToNull(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Normalize once; empty/whitespace strings become null. Drops .env.example placeholders. */
export function normalizeExecutiveFooterContact(input: {
  whatsappHref?: string | null;
  phone?: string | null;
  phoneHref?: string | null;
  email?: string | null;
  emailHref?: string | null;
}): ExecutiveFooterContact {
  const phone = absentToNull(input.phone);
  const email = absentToNull(input.email);
  const hidePhone = isExamplePhone(phone);
  const hideEmail = isExampleEmail(email);
  return {
    whatsappHref: absentToNull(input.whatsappHref),
    phone: hidePhone ? null : phone,
    phoneHref: hidePhone ? null : absentToNull(input.phoneHref),
    email: hideEmail ? null : email,
    emailHref: hideEmail ? null : absentToNull(input.emailHref),
  };
}

/**
 * Renderable footer channels from already-normalized values.
 * WhatsApp may stand alone; email/phone require both visible text and href.
 */
export function executiveFooterContactChannels(
  contact: ExecutiveFooterContact,
  labels: { whatsapp: string },
): ExecutiveFooterContactChannel[] {
  const channels: ExecutiveFooterContactChannel[] = [];

  if (contact.whatsappHref) {
    channels.push({
      kind: "whatsapp",
      href: contact.whatsappHref,
      label: labels.whatsapp,
    });
  }

  if (contact.email && contact.emailHref) {
    channels.push({
      kind: "email",
      href: contact.emailHref,
      label: contact.email,
    });
  }

  if (contact.phone && contact.phoneHref) {
    channels.push({
      kind: "phone",
      href: contact.phoneHref,
      label: contact.phone,
    });
  }

  return channels;
}

export function executiveHasVisibleContact(input: {
  whatsappHref?: string | null;
  phone?: string | null;
  phoneHref?: string | null;
  email?: string | null;
  emailHref?: string | null;
}): boolean {
  const contact = normalizeExecutiveFooterContact(input);
  return executiveFooterContactChannels(contact, { whatsapp: "WhatsApp" }).length > 0;
}
