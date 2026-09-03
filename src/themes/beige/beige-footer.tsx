import Link from "next/link";
import { fillTemplate, localizeSiteHref, localizedHref } from "@/lib/site-i18n";
import { beigeContactChannels } from "@/themes/beige/beige-contact-channels";
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
  const { brand, footer, legal, social } = content;
  const navLinks = [
    ...beigeNavLinks(dict, locale, defaultLocale),
    {
      href: localizedHref("/#contacto", locale, null, defaultLocale),
      label: dict.nav.contact,
    },
  ];
  const channels = beigeContactChannels(content);
  const whatsappHref = channels.whatsappHref;
  const whatsappNumber = channels.whatsappNumber;
  const year = new Date().getFullYear();
  const showWhatsApp = Boolean(whatsappHref && whatsappNumber);
  const showOffice = Boolean(channels.phoneHref && channels.phone);
  const showPhones = showWhatsApp || showOffice;
  const showEmail = Boolean(
    content.contact.emailHref && content.contact.email,
  );
  const hasSocial = Boolean(social.instagramUrl || social.facebookUrl);

  const linkClass =
    "inline-flex items-center gap-2.5 transition-colors hover:text-[#C4D3A2]";
  const iconClass = "h-4 w-4 shrink-0 text-[#A4B494]";
  const headingClass =
    "mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5]";

  return (
    <footer className="bg-[#2D2A26] text-[#E5D9C5]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
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

        <nav aria-label={dict.a11y.footerNav}>
          <p className={headingClass}>{dict.footer.navigation}</p>
          <ul className="space-y-3 text-[0.9375rem]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-[#C4D3A2]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-10">
          {showPhones ? (
            <div data-beige-footer-phones>
              <p className={headingClass}>{copy.phonesHeading}</p>
              <ul className="space-y-4 text-[0.9375rem]">
                {showWhatsApp && whatsappHref && whatsappNumber ? (
                  <li>
                    <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#A39073]">
                      {copy.whatsappPrefix}
                    </p>
                    <a
                      href={whatsappHref}
                      className={linkClass}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-beige-cta="footer-whatsapp"
                      aria-label={`${copy.whatsappPrefix}: ${formatBeigePhoneDisplay(whatsappNumber)}. ${dict.a11y.opensInNewTab}`}
                    >
                      <BeigeIconWhatsApp className={iconClass} />
                      <span className="truncate">
                        {formatBeigePhoneDisplay(whatsappNumber)}
                      </span>
                    </a>
                  </li>
                ) : null}
                {showOffice && channels.phoneHref && channels.phone ? (
                  <li>
                    <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#A39073]">
                      {copy.officeLabel}
                    </p>
                    <a
                      href={channels.phoneHref}
                      className={linkClass}
                      data-beige-cta="footer-call"
                    >
                      <BeigeIconPhone className={iconClass} />
                      <span className="truncate">
                        {formatBeigePhoneDisplay(channels.phone)}
                      </span>
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}

          {showEmail ? (
            <div data-beige-footer-email>
              <p className={headingClass}>{copy.emailHeading}</p>
              <a
                href={content.contact.emailHref ?? undefined}
                className={`${linkClass} break-all`}
                data-beige-cta="footer-email"
              >
                <BeigeIconMail className={iconClass} />
                <span className="truncate">{content.contact.email}</span>
              </a>
            </div>
          ) : null}
        </div>

        <div className="space-y-10">
          {hasSocial ? (
            <BeigeSocialLinks
              social={social}
              dict={dict}
              heading={copy.followHeading}
            />
          ) : null}

          <nav aria-label={dict.a11y.legalNav}>
            <p className={headingClass}>{dict.footer.legal}</p>
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
