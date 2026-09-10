import Link from "next/link";
import { fillTemplate, localizeSiteHref } from "@/lib/site-i18n";
import { yellowContactChannels } from "@/themes/yellow/yellow-contact-channels";
import {
  brandInitial,
  YELLOW_LOGO_FOOTER_CLASS,
} from "@/themes/yellow/yellow-display";
import { YellowLogo } from "@/themes/yellow/yellow-logo";
import { YellowSocialLinks } from "@/themes/yellow/yellow-social-links";
import { getYellowUi, yellowNavLinks } from "@/themes/yellow/yellow-ui";

type Props = {
  lang?: string;
};

export async function YellowFooter({ lang }: Props) {
  const { content, dict, locale, defaultLocale } = await getYellowUi(lang);
  const { brand, footer, legal, social, contact } = content;
  const links = yellowNavLinks(dict, locale, defaultLocale);
  const whatsappHref = yellowContactChannels(content).whatsappHref;
  const hasSocial = Boolean(social.instagramUrl || social.facebookUrl);
  const hasContact = Boolean(
    whatsappHref || contact.phoneHref || contact.emailHref,
  );
  const year = new Date().getFullYear();
  const initial = brandInitial(brand.name);

  return (
    <footer className="yellow-footer">
      <div className="yellow-shell yellow-footer__grid">
        <div className="yellow-footer__brand-col">
          <div className="yellow-footer__brand-row">
            {brand.logoUrl ? (
              <YellowLogo
                src={brand.logoUrl}
                alt={brand.name}
                className={YELLOW_LOGO_FOOTER_CLASS}
                fallbackClassName="yellow-footer__mark"
              />
            ) : (
              <span className="yellow-footer__mark" aria-hidden>
                {initial || "·"}
              </span>
            )}
            <span className="yellow-footer__brand">{brand.name}</span>
          </div>
          <p className="yellow-footer__description">
            {footer.description || dict.footer.description}
          </p>
        </div>

        <nav aria-label={dict.a11y.footerNav}>
          <p className="yellow-footer__heading">{dict.footer.navigation}</p>
          <ul className="yellow-footer__list">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="yellow-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {hasContact ? (
          <div>
            <p className="yellow-footer__heading">{dict.footer.contact}</p>
            <ul className="yellow-footer__list">
              {whatsappHref ? (
                <li>
                  <a
                    href={whatsappHref}
                    className="yellow-footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${dict.whatsapp.footer}. ${dict.a11y.opensInNewTab}`}
                  >
                    {dict.whatsapp.footer}
                  </a>
                </li>
              ) : null}
              {contact.emailHref && contact.email ? (
                <li>
                  <a href={contact.emailHref} className="yellow-footer__link yellow-footer__link--accent">
                    {contact.email}
                  </a>
                </li>
              ) : null}
              {contact.phoneHref && contact.phone ? (
                <li>
                  <a href={contact.phoneHref} className="yellow-footer__link">
                    {contact.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}

        <div className="yellow-footer__legal-col">
          {hasSocial ? (
            <YellowSocialLinks
              social={social}
              dict={dict}
              heading={dict.footer.follow}
            />
          ) : null}
          <nav aria-label={dict.a11y.legalNav}>
            <p className="yellow-footer__heading">{dict.footer.legal}</p>
            <ul className="yellow-footer__list">
              <li>
                <Link
                  href={localizeSiteHref(
                    legal.privacyNoticeUrl,
                    locale,
                    defaultLocale,
                  )}
                  className="yellow-footer__link"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={localizeSiteHref(legal.termsUrl, locale, defaultLocale)}
                  className="yellow-footer__link"
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
                    className="yellow-footer__link"
                  >
                    {dict.footer.cookies}
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </div>

      <div className="yellow-footer__bottom">
        <p>
          {fillTemplate(dict.footer.copyright, {
            year,
            name: brand.name,
          })}
        </p>
        {footer.showPoweredBy ? (
          <p>
            {dict.footer.poweredBy}{" "}
            <Link href="https://evenia.mx" className="yellow-footer__credit-link">
              Evenia
            </Link>
          </p>
        ) : null}
      </div>
    </footer>
  );
}
