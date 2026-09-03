import Link from "next/link";
import { fillTemplate, localizeSiteHref, localizedHref } from "@/lib/site-i18n";
import { getBeigeCopy } from "@/themes/beige/beige-copy";
import {
  BEIGE_LOGO_FOOTER_CLASS,
  formatBeigePhoneDisplay,
} from "@/themes/beige/beige-display";
import {
  BeigeIconMail,
  BeigeIconPhone,
  BeigeIconWhatsApp,
} from "@/themes/beige/beige-icons";
import { BeigeLogo } from "@/themes/beige/beige-logo";
import { BeigeSocialLinks } from "@/themes/beige/beige-social-links";
import { beigeNavLinks, getBeigeUi } from "@/themes/beige/beige-ui";

type Props = {
  lang?: string;
};

export async function BeigeFooter({ lang }: Props) {
  const { content, dict, locale, defaultLocale } = await getBeigeUi(lang);
  const copy = getBeigeCopy(locale);
  const { brand, contact, footer, legal, social } = content;
  const navLinks = [
    ...beigeNavLinks(dict, locale, defaultLocale),
    {
      href: localizedHref("/#contacto", locale, null, defaultLocale),
      label: dict.nav.contact,
    },
  ];
  const whatsappHref = content.whatsapp.href ?? contact.whatsappHref;
  const whatsappNumber =
    content.whatsapp.number ?? contact.whatsappNumber ?? null;
  const year = new Date().getFullYear();
  const hasContact = Boolean(
    whatsappHref || contact.phoneHref || contact.emailHref,
  );
  const hasSocial = Boolean(social.instagramUrl || social.facebookUrl);

  const linkClass =
    "inline-flex items-center gap-2.5 transition-colors hover:text-[#C4D3A2]";
  const iconClass = "h-4 w-4 shrink-0 text-[#A4B494]";

  return (
    <footer className="bg-[#2D2A26] text-[#E5D9C5]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
        {/* Column 1 — Brand */}
        <div>
          {brand.logoUrl ? (
            <BeigeLogo
              src={brand.logoUrl}
              alt={brand.name}
              className={BEIGE_LOGO_FOOTER_CLASS}
              fallbackClassName="beige-serif mb-5 text-2xl text-[#FBF9F5]"
            />
          ) : (
            <p className="beige-serif mb-5 text-2xl text-[#FBF9F5]">
              {brand.name}
            </p>
          )}
          <p className="text-sm leading-relaxed text-[#A39073]">
            {process.env.SITE_FOOTER_DESCRIPTION?.trim() ||
              dict.footer.description}
          </p>
        </div>

        {/* Column 2 — Navigation */}
        <nav aria-label={dict.a11y.footerNav}>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5]">
            {dict.footer.navigation}
          </p>
          <ul className="space-y-3 text-[0.9375rem]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[#C4D3A2]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Column 3 — Contact */}
        {hasContact ? (
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5]">
              {dict.footer.contact}
            </p>
            <ul className="space-y-3 text-[0.9375rem]">
              {whatsappHref && whatsappNumber ? (
                <li>
                  <a
                    href={whatsappHref}
                    className={linkClass}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${copy.whatsappPrefix}: ${formatBeigePhoneDisplay(whatsappNumber)}. ${dict.a11y.opensInNewTab}`}
                  >
                    <BeigeIconWhatsApp className={iconClass} />
                    <span className="truncate">
                      {formatBeigePhoneDisplay(whatsappNumber)}
                    </span>
                  </a>
                </li>
              ) : whatsappHref ? (
                <li>
                  <a
                    href={whatsappHref}
                    className={linkClass}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${dict.whatsapp.footer}. ${dict.a11y.opensInNewTab}`}
                  >
                    <BeigeIconWhatsApp className={iconClass} />
                    <span>{copy.whatsappPrefix}</span>
                  </a>
                </li>
              ) : null}
              {contact.phoneHref && contact.phone ? (
                <li>
                  <a href={contact.phoneHref} className={linkClass}>
                    <BeigeIconPhone className={iconClass} />
                    <span className="truncate">
                      {formatBeigePhoneDisplay(contact.phone)}
                    </span>
                  </a>
                </li>
              ) : null}
              {contact.emailHref && contact.email ? (
                <li>
                  <a
                    href={contact.emailHref}
                    className={`${linkClass} break-all`}
                  >
                    <BeigeIconMail className={iconClass} />
                    <span className="truncate">{contact.email}</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}

        {/* Column 4 — Social + Legal */}
        <div className="space-y-10">
          {hasSocial ? (
            <BeigeSocialLinks
              social={social}
              dict={dict}
              heading={dict.footer.follow}
            />
          ) : null}

          <nav aria-label={dict.a11y.legalNav}>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5]">
              {dict.footer.legal}
            </p>
            <ul className="space-y-3 text-[0.9375rem]">
              <li>
                <Link
                  href={localizeSiteHref(
                    legal.privacyNoticeUrl,
                    locale,
                    defaultLocale,
                  )}
                  className="transition-colors hover:text-[#C4D3A2]"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={localizeSiteHref(legal.termsUrl, locale, defaultLocale)}
                  className="transition-colors hover:text-[#C4D3A2]"
                >
                  {dict.footer.terms}
                </Link>
              </li>
              {legal.cookiesUrl ? (
                <li>
                  <Link
                    href={localizeSiteHref(
                      legal.cookiesUrl,
                      locale,
                      defaultLocale,
                    )}
                    className="transition-colors hover:text-[#C4D3A2]"
                  >
                    {dict.footer.cookies}
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-sm text-[#A39073]">
        <p>
          {fillTemplate(dict.footer.copyright, {
            year,
            name: brand.name,
          })}
        </p>
        {footer.showPoweredBy ? (
          <p className="mt-2">
            {dict.footer.poweredBy}{" "}
            <Link href="https://evenia.mx" className="text-[#C4D3A2]">
              Evenia
            </Link>
          </p>
        ) : null}
      </div>
    </footer>
  );
}
