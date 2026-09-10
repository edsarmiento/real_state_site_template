export function executiveHasVisibleContact(input: {
  whatsappHref?: string | null;
  phone?: string | null;
  phoneHref?: string | null;
  email?: string | null;
  emailHref?: string | null;
}): boolean {
  const whatsappHref = input.whatsappHref?.trim() || null;
  const phone = input.phone?.trim() || null;
  const phoneHref = input.phoneHref?.trim() || null;
  const email = input.email?.trim() || null;
  const emailHref = input.emailHref?.trim() || null;
  return Boolean(
    whatsappHref ||
      (phoneHref && phone) ||
      (emailHref && email),
  );
}
