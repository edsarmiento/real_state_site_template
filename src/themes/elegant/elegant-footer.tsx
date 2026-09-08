import Link from "next/link";
import { fillTemplate, localizeSiteHref } from "@/lib/site-i18n";
import { elegantContactChannels } from "@/themes/elegant/elegant-contact-channels";
import { ElegantLogo } from "@/themes/elegant/elegant-logo";
import { ElegantSocialLinks } from "@/themes/elegant/elegant-social-links";
import {
  elegantBrandInitials,
  elegantNavLinks,
  getElegantUi,
} from "@/themes/elegant/elegant-ui";

type Props = {
  lang?: string;
};

export async function ElegantFooter({ lang }: Props) {
  const { content, dict, locale, defaultLocale } = await getElegantUi(lang);
  const { brand, footer, legal, social, contact } = content;
  const links = elegantNavLinks(dict, locale, defaultLocale);
  const whatsappHref = elegantContactChannels(content).whatsappHref;
  const hasContact = Boolean(
    whatsappHref || contact.phoneHref || contact.emailHref,
  );
  const year = new Date().getFullYear();
  const initials = elegantBrandInitials(brand.name);

  return (
    <footer className="elegant-footer">
      <div className="elegant-shell elegant-footer__grid">
        <div className="elegant-footer__brand">
          {brand.logoUrl ? (
            <ElegantLogo
              src={brand.logoUrl}
              alt={brand.name}
              className="elegant-footer__logo"
              fallbackClassName="elegant-footer__name"
            />
          ) : (
            <p className="elegant-brand">
              <span className="elegant-brand__mark" aria-hidden>
                {initials}
              </span>
              <span className="elegant-brand__name">{brand.name}</span>
            </p>
          )}
          <p className="elegant-footer__desc">
            {footer.description || dict.footer.description}
          </p>
        </div>

        <nav aria-label={dict.a11y.footerNav}>
          <p className="elegant-footer__heading">{dict.footer.navigation}</p>
          <ul className="elegant-footer__list">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="elegant-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {hasContact ? (
          <div>
            <p className="elegant-footer__heading">{dict.footer.contact}</p>
            <ul className="elegant-footer__list">
              {whatsappHref ? (
                <li>
                  <a
                    href={whatsappHref}
                    className="elegant-footer__link"
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
                  <a href={contact.emailHref} className="elegant-footer__link">
                    {contact.email}
                  </a>
                </li>
              ) : null}
              {contact.phoneHref && contact.phone ? (
                <li>
                  <a href={contact.phoneHref} className="elegant-footer__link">
                    {contact.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}

        <div>
          <ElegantSocialLinks
            social={social}
            dict={dict}
            heading={dict.footer.follow}
            accentHeading
          />
          <nav aria-label={dict.a11y.legalNav} className="elegant-footer__legal">
            <p className="elegant-footer__heading">{dict.footer.legal}</p>
            <ul className="elegant-footer__list">
              <li>
                <Link
                  href={localizeSiteHref(
                    legal.privacyNoticeUrl,
                    locale,
                    defaultLocale,
                  )}
                  className="elegant-footer__link"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={localizeSiteHref(legal.termsUrl, locale, defaultLocale)}
                  className="elegant-footer__link"
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
                    className="elegant-footer__link"
                  >
                    {dict.footer.cookies}
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </div>

      <div className="elegant-shell elegant-footer__bottom">
        <p>
          {fillTemplate(dict.footer.copyright, {
            year,
            name: brand.name,
          })}
        </p>
        {footer.showPoweredBy ? (
          <p>{dict.footer.poweredBy} Evenia</p>
        ) : null}
      </div>
    </footer>
  );
}
