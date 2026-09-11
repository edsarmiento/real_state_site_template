import Link from "next/link";
import { isExampleEmail } from "@/lib/example-contact";
import { fillTemplate, localizeSiteHref } from "@/lib/site-i18n";
import { darkBrandMonogram, getDarkCopy } from "@/themes/dark/dark-copy";
import { darkContactChannels } from "@/themes/dark/dark-contact-channels";
import { DarkLogo } from "@/themes/dark/dark-logo";
import { DarkReveal } from "@/themes/dark/dark-reveal";
import { DarkSocialLinks } from "@/themes/dark/dark-social-links";
import { darkNavLinks, type DarkUi } from "@/themes/dark/dark-ui";

type Props = {
  ui: DarkUi;
};

export function DarkFooter({ ui }: Props) {
  const { content, dict, locale, defaultLocale } = ui;
  const { brand, footer, legal, social, contact } = content;
  const links = darkNavLinks(dict, locale, defaultLocale);
  const { whatsappHref, phone, phoneHref } = darkContactChannels(content);
  const email =
    contact.email && !isExampleEmail(contact.email) ? contact.email : null;
  const emailHref = email ? contact.emailHref : null;
  const showPhone = Boolean(phone && phoneHref);
  const hasSocial = Boolean(social.instagramUrl || social.facebookUrl);
  const hasContact = Boolean(whatsappHref || showPhone || emailHref);
  const copy = getDarkCopy(locale);
  const monogram = darkBrandMonogram(brand.name, copy.brandMarkFallback);
  const year = new Date().getFullYear();

  return (
    <footer className="dark-footer">
      <DarkReveal variant="fade">
        <div className="dark-shell dark-footer__grid">
          <div>
            {brand.logoUrl ? (
              <DarkLogo
                src={brand.logoUrl}
                alt={brand.name}
                className="dark-logo--footer"
                fallbackClassName="dark-footer__brand"
              />
            ) : (
              <p className="dark-footer__brand-row">
                <span className="dark-logo-mark dark-logo-mark--sm" aria-hidden>
                  {monogram}
                </span>
                <span className="dark-footer__brand">{brand.name}</span>
              </p>
            )}
            <p className="dark-footer__description">
              {footer.description || dict.footer.description}
            </p>
          </div>

          <nav aria-label={dict.a11y.footerNav}>
            <p className="dark-footer__heading">{dict.footer.navigation}</p>
            <ul className="dark-footer__list">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="dark-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {hasContact ? (
            <div>
              <p className="dark-footer__heading">{dict.footer.contact}</p>
              <ul className="dark-footer__list">
                {whatsappHref ? (
                  <li>
                    <a
                      href={whatsappHref}
                      className="dark-footer__link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${dict.whatsapp.footer}. ${dict.a11y.opensInNewTab}`}
                    >
                      {dict.whatsapp.footer}
                    </a>
                  </li>
                ) : null}
                {emailHref && email ? (
                  <li>
                    <a href={emailHref} className="dark-footer__link">
                      {email}
                    </a>
                  </li>
                ) : null}
                {showPhone && phone && phoneHref ? (
                  <li>
                    <a href={phoneHref} className="dark-footer__link">
                      {phone}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}

          <div className="dark-footer__end">
            {hasSocial ? (
              <DarkSocialLinks
                social={social}
                dict={dict}
                heading={dict.footer.follow}
              />
            ) : null}
            <nav aria-label={dict.a11y.legalNav}>
              <p className="dark-footer__heading">{dict.footer.legal}</p>
              <ul className="dark-footer__list">
                <li>
                  <Link
                    href={localizeSiteHref(
                      legal.privacyNoticeUrl,
                      locale,
                      defaultLocale,
                    )}
                    className="dark-footer__link"
                  >
                    {dict.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeSiteHref(legal.termsUrl, locale, defaultLocale)}
                    className="dark-footer__link"
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
                      className="dark-footer__link"
                    >
                      {dict.footer.cookies}
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>
        </div>
      </DarkReveal>

      <div className="dark-footer__bottom">
        <p>
          {fillTemplate(dict.footer.copyright, {
            year,
            name: brand.name,
          })}
        </p>
        {footer.showPoweredBy ? (
          <p>
            {dict.footer.poweredBy}{" "}
            <Link href="https://evenia.mx" className="dark-footer__credit-link">
              Evenia
            </Link>
          </p>
        ) : null}
      </div>
    </footer>
  );
}
