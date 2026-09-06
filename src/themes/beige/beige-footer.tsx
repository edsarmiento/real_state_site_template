import Link from "next/link";
import { fillTemplate, localizeSiteHref } from "@/lib/site-i18n";
import { beigeContactChannels } from "@/themes/beige/beige-contact-channels";
import { BEIGE_LOGO_FOOTER_CLASS } from "@/themes/beige/beige-display";
import { BeigeLogo } from "@/themes/beige/beige-logo";
import { BeigeReveal } from "@/themes/beige/beige-reveal";
import { BeigeSocialLinks } from "@/themes/beige/beige-social-links";
import { beigeNavLinks, getBeigeUi } from "@/themes/beige/beige-ui";

type Props = {
  lang?: string;
};

export async function BeigeFooter({ lang }: Props) {
  const { content, dict, locale, defaultLocale } = await getBeigeUi(lang);
  const { brand, footer, legal, social, contact } = content;
  const links = beigeNavLinks(dict, locale, defaultLocale);
  const whatsappHref = beigeContactChannels(content).whatsappHref;
  const hasSocial = Boolean(social.instagramUrl || social.facebookUrl);
  const hasContact = Boolean(
    whatsappHref || contact.phoneHref || contact.emailHref,
  );
  const year = new Date().getFullYear();

  return (
    <footer className="beige-footer">
      <BeigeReveal variant="fade">
        <div className="beige-shell beige-footer__grid">
          <div>
            {brand.logoUrl ? (
              <BeigeLogo
                src={brand.logoUrl}
                alt={brand.name}
                className={BEIGE_LOGO_FOOTER_CLASS}
                fallbackClassName="beige-footer__brand"
              />
            ) : (
              <p className="beige-footer__brand">{brand.name}</p>
            )}
            <p className="beige-footer__description">
              {footer.description || dict.footer.description}
            </p>
            {contact.location ? (
              <p className="beige-footer__location">{contact.location}</p>
            ) : null}
          </div>

          <nav aria-label={dict.a11y.footerNav}>
            <p className="beige-footer__heading">{dict.footer.navigation}</p>
            <ul className="beige-footer__list">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="beige-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {hasContact ? (
            <div>
              <p className="beige-footer__heading">{dict.footer.contact}</p>
              <ul className="beige-footer__list">
                {whatsappHref ? (
                  <li>
                    <a
                      href={whatsappHref}
                      className="beige-footer__link"
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
                    <a href={contact.emailHref} className="beige-footer__link">
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact.phoneHref && contact.phone ? (
                  <li>
                    <a href={contact.phoneHref} className="beige-footer__link">
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}

          <div className="space-y-10">
            {hasSocial ? (
              <BeigeSocialLinks
                social={social}
                dict={dict}
                heading={dict.footer.follow}
              />
            ) : null}
            <nav aria-label={dict.a11y.legalNav}>
              <p className="beige-footer__heading">{dict.footer.legal}</p>
              <ul className="beige-footer__list">
                <li>
                  <Link
                    href={localizeSiteHref(
                      legal.privacyNoticeUrl,
                      locale,
                      defaultLocale,
                    )}
                    className="beige-footer__link"
                  >
                    {dict.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeSiteHref(legal.termsUrl, locale, defaultLocale)}
                    className="beige-footer__link"
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
                      className="beige-footer__link"
                    >
                      {dict.footer.cookies}
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>
        </div>
      </BeigeReveal>

      <div className="beige-footer__bottom">
        <p>
          {fillTemplate(dict.footer.copyright, {
            year,
            name: brand.name,
          })}
        </p>
        {footer.showPoweredBy ? (
          <p className="mt-2">
            {dict.footer.poweredBy}{" "}
            <Link href="https://evenia.mx" className="beige-footer__credit-link">
              Evenia
            </Link>
          </p>
        ) : null}
      </div>
    </footer>
  );
}
