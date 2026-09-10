import Link from "next/link";
import { fillTemplate, localizeSiteHref } from "@/lib/site-i18n";
import { executiveContactChannels } from "@/themes/executive/executive-contact-channels";
import { executiveBrandInitial } from "@/themes/executive/executive-brand";
import { executiveHasVisibleContact } from "@/themes/executive/executive-footer-contact";
import { ExecutiveLogo } from "@/themes/executive/executive-logo";
import { ExecutiveSocialLinks } from "@/themes/executive/executive-social-links";
import { executiveNavLinks, getExecutiveUi } from "@/themes/executive/executive-ui";

type Props = {
  lang?: string;
};

export async function ExecutiveFooter({ lang }: Props) {
  const { content, dict, locale, defaultLocale } = await getExecutiveUi(lang);
  const { brand, footer, legal, social, contact } = content;
  const links = executiveNavLinks(dict, locale, defaultLocale);
  const whatsappHref = executiveContactChannels(content).whatsappHref;
  const hasContact = executiveHasVisibleContact({
    whatsappHref,
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    email: contact.email,
    emailHref: contact.emailHref,
  });
  const year = new Date().getFullYear();
  const initial = executiveBrandInitial(brand.name);

  return (
    <footer className="executive-footer">
      <div className="executive-shell executive-footer__grid">
        <div className="executive-footer__brand-col">
          <div className="executive-footer__brand">
            {brand.logoUrl ? (
              <ExecutiveLogo
                key={brand.logoUrl}
                src={brand.logoUrl}
                alt={brand.name}
                className="executive-logo--footer"
                fallback={initial}
              />
            ) : (
              <span className="executive-mark executive-mark--sm" aria-hidden>
                {initial}
              </span>
            )}
            <span className="executive-footer__brand-name">{brand.name}</span>
          </div>
          <p className="executive-footer__description">
            {footer.description || dict.footer.description}
          </p>
        </div>

        <nav aria-label={dict.a11y.footerNav}>
          <p className="executive-footer__heading">{dict.footer.navigation}</p>
          <ul className="executive-footer__list">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="executive-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {hasContact ? (
          <div>
            <p className="executive-footer__heading">{dict.footer.contact}</p>
            <ul className="executive-footer__list">
              {whatsappHref ? (
                <li>
                  <a
                    href={whatsappHref}
                    className="executive-footer__link"
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
                  <a href={contact.emailHref} className="executive-footer__link executive-footer__link--sand">
                    {contact.email}
                  </a>
                </li>
              ) : null}
              {contact.phoneHref && contact.phone ? (
                <li>
                  <a href={contact.phoneHref} className="executive-footer__link">
                    {contact.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}

        <div>
          <ExecutiveSocialLinks social={social} dict={dict} heading={dict.footer.follow} />
          <nav aria-label={dict.a11y.legalNav}>
            <p className="executive-footer__heading">{dict.footer.legal}</p>
            <ul className="executive-footer__list">
              <li>
                <Link
                  href={localizeSiteHref(legal.privacyNoticeUrl, locale, defaultLocale)}
                  className="executive-footer__link"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={localizeSiteHref(legal.termsUrl, locale, defaultLocale)}
                  className="executive-footer__link"
                >
                  {dict.footer.terms}
                </Link>
              </li>
              {legal.cookiesUrl ? (
                <li>
                  <Link
                    href={localizeSiteHref(legal.cookiesUrl, locale, defaultLocale)}
                    className="executive-footer__link"
                  >
                    {dict.footer.cookies}
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </div>

      <div className="executive-footer__bottom">
        <p>
          {fillTemplate(dict.footer.copyright, {
            year,
            name: brand.name,
          })}
        </p>
        {footer.showPoweredBy ? (
          <p className="executive-footer__powered">
            {dict.footer.poweredBy}{" "}
            <Link href="https://evenia.mx" className="executive-footer__credit">
              Evenia
            </Link>
          </p>
        ) : null}
      </div>
    </footer>
  );
}
