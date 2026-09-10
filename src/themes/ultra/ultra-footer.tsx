import Link from "next/link";
import { fillTemplate, localizeSiteHref } from "@/lib/site-i18n";
import { ultraContactChannels } from "@/themes/ultra/ultra-contact-channels";
import { UltraSocialLinks } from "@/themes/ultra/ultra-social-links";
import { getUltraCopy } from "@/themes/ultra/ultra-copy";
import { loadUltraUi, ultraNavLinks } from "@/themes/ultra/ultra-ui";

type Props = {
  lang?: string;
};

export async function UltraFooter({ lang }: Props) {
  const { content, dict, locale, defaultLocale } = await loadUltraUi(lang);
  const { brand, footer, legal, social, contact } = content;
  const links = ultraNavLinks(dict, locale, defaultLocale);
  const whatsappHref = ultraContactChannels(content).whatsappHref;
  const hasSocial = Boolean(
    social.instagramUrl || social.facebookUrl || whatsappHref,
  );
  const hasContact = Boolean(
    whatsappHref || contact.phoneHref || contact.emailHref,
  );
  const year = new Date().getFullYear();
  const copy = getUltraCopy(locale);

  return (
    <footer className="ultra-footer">
      <div className="ultra-shell ultra-footer__grid">
        <div>
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="ultra-footer__logo"
            />
          ) : (
            <p className="ultra-footer__brand">{brand.name}</p>
          )}
          <p className="ultra-footer__description">
            {footer.description || dict.footer.description}
          </p>
          {contact.location ? (
            <p className="ultra-footer__location">{contact.location}</p>
          ) : null}
        </div>

        <nav aria-label={dict.a11y.footerNav}>
          <p className="ultra-footer__heading">{dict.footer.navigation}</p>
          <ul className="ultra-footer__list">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="ultra-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {hasContact ? (
          <div>
            <p className="ultra-footer__heading">{dict.footer.contact}</p>
            <ul className="ultra-footer__list">
              {whatsappHref ? (
                <li>
                  <a
                    href={whatsappHref}
                    className="ultra-footer__link"
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
                  <a href={contact.emailHref} className="ultra-footer__link">
                    {contact.email}
                  </a>
                </li>
              ) : null}
              {contact.phoneHref && contact.phone ? (
                <li>
                  <a href={contact.phoneHref} className="ultra-footer__link">
                    {contact.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}

        <div className="space-y-10">
          {hasSocial ? (
            <UltraSocialLinks
              social={social}
              dict={dict}
              heading={dict.footer.follow}
              whatsappHref={whatsappHref}
            />
          ) : null}
          <nav aria-label={dict.a11y.legalNav}>
            <p className="ultra-footer__heading">{dict.footer.legal}</p>
            <ul className="ultra-footer__list">
              <li>
                <Link
                  href={localizeSiteHref(
                    legal.privacyNoticeUrl,
                    locale,
                    defaultLocale,
                  )}
                  className="ultra-footer__link"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={localizeSiteHref(legal.termsUrl, locale, defaultLocale)}
                  className="ultra-footer__link"
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
                    className="ultra-footer__link"
                  >
                    {dict.footer.cookies}
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </div>

      <div className="ultra-footer__bottom">
        <p>
          {fillTemplate(dict.footer.copyright, {
            year,
            name: brand.name,
          })}
        </p>
        {footer.showPoweredBy ? (
          <p className="ultra-footer__powered">{copy.poweredBy}</p>
        ) : null}
      </div>
    </footer>
  );
}
