import Link from "next/link";
import { fillTemplate, localizeSiteHref } from "@/lib/site-i18n";
import { LuxuryLogo } from "@/themes/luxury/luxury-logo";
import { LuxurySocialLinks } from "@/themes/luxury/luxury-social-links";
import { getLuxuryUi, luxuryNavLinks } from "@/themes/luxury/luxury-ui";

type Props = {
  lang?: string;
};

export async function LuxuryFooter({ lang }: Props) {
  const { content, dict, locale, defaultLocale } = await getLuxuryUi(lang);
  const { brand, contact, footer, legal, social } = content;
  const links = luxuryNavLinks(dict, locale, defaultLocale);
  const whatsappHref = content.whatsapp.href ?? contact.whatsappHref;
  const hasSocial = Boolean(social.instagramUrl || social.facebookUrl);
  const hasContact = Boolean(
    whatsappHref || contact.phoneHref || contact.emailHref,
  );

  return (
    <footer className="luxury-footer">
      <div
        className={
          hasSocial && hasContact
            ? "luxury-footer__inner"
            : "luxury-footer__inner luxury-footer__inner--compact"
        }
      >
        <div className="luxury-footer__brand-block">
          {brand.logoUrl ? (
            <LuxuryLogo
              src={brand.logoUrl}
              alt={brand.name}
              className="luxury-footer__logo"
              fallbackClassName="luxury-footer__brand"
            />
          ) : (
            <p className="luxury-footer__brand">{brand.name}</p>
          )}
          <p className="luxury-footer__copy">
            {process.env.SITE_FOOTER_DESCRIPTION?.trim() || dict.footer.description}
          </p>
          {contact.location ? (
            <p className="luxury-footer__meta">{contact.location}</p>
          ) : null}
        </div>

        <nav className="luxury-footer__nav" aria-label={dict.a11y.footerNav}>
          <p className="luxury-footer__heading">{dict.footer.navigation}</p>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="luxury-footer__link">
              {link.label}
            </Link>
          ))}
        </nav>

        {hasContact ? (
          <div className="luxury-footer__contact">
            <p className="luxury-footer__heading">{dict.footer.contact}</p>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                className="luxury-footer__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${dict.whatsapp.footer}. ${dict.a11y.opensInNewTab}`}
              >
                {dict.whatsapp.footer}
              </a>
            ) : null}
            {contact.emailHref && contact.email ? (
              <a href={contact.emailHref} className="luxury-footer__link">
                {contact.email}
              </a>
            ) : null}
            {contact.phoneHref && contact.phone ? (
              <a href={contact.phoneHref} className="luxury-footer__link">
                {contact.phone}
              </a>
            ) : null}
          </div>
        ) : null}

        {hasSocial ? (
          <div className="luxury-footer__social">
            <p className="luxury-footer__heading">{dict.footer.follow}</p>
            <LuxurySocialLinks
              social={social}
              dict={dict}
              surface="dark"
            />
          </div>
        ) : null}

        <nav className="luxury-footer__legal-nav" aria-label={dict.a11y.legalNav}>
          <p className="luxury-footer__heading">{dict.footer.legal}</p>
          <ul className="luxury-footer__list">
            <li>
              <Link
                href={localizeSiteHref(
                  legal.privacyNoticeUrl,
                  locale,
                  defaultLocale,
                )}
                className="luxury-footer__link"
              >
                {dict.footer.privacy}
              </Link>
            </li>
            <li>
              <Link
                href={localizeSiteHref(legal.termsUrl, locale, defaultLocale)}
                className="luxury-footer__link"
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
                  className="luxury-footer__link"
                >
                  {dict.footer.cookies}
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>

      <div className="luxury-footer__legal">
        <p>
          {fillTemplate(dict.footer.copyright, {
            year: new Date().getFullYear(),
            name: brand.name,
          })}
        </p>
        {footer.showPoweredBy ? (
          <p className="luxury-footer__credit">
            {dict.footer.poweredBy}{" "}
            <Link href="https://evenia.mx" className="luxury-footer__credit-link">
              Evenia
            </Link>
          </p>
        ) : null}
      </div>
    </footer>
  );
}