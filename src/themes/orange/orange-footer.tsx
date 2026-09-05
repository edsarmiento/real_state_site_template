import Link from "next/link";
import { fillTemplate, localizeSiteHref } from "@/lib/site-i18n";
import {
  OrangeIconFacebook,
  OrangeIconInstagram,
} from "@/themes/orange/orange-icons";
import { OrangeLogo } from "@/themes/orange/orange-logo";
import { getOrangeUi, orangeNavLinks } from "@/themes/orange/orange-ui";

type Props = {
  lang?: string;
};

export async function OrangeFooter({ lang }: Props) {
  const { content, dict, copy, locale, defaultLocale } = await getOrangeUi(lang);
  const { brand, contact, footer, legal, about, social } = content;
  const showTestimonials = content.testimonials.length > 0;
  const showAbout = Boolean(about.title.trim());
  const links = orangeNavLinks({
    dict,
    copy,
    locale,
    defaultLocale,
    showServices: true,
    showTestimonials,
    showAbout,
  });
  const whatsappHref = content.whatsapp.href ?? contact.whatsappHref;
  const quote = about.description.trim();
  const year = new Date().getFullYear();

  return (
    <footer className="orange-footer">
      <div className="orange-footer__grid">
        <div className="orange-footer__brand">
          {brand.logoUrl ? (
            <OrangeLogo
              src={brand.logoUrl}
              alt={brand.name}
              className="orange-footer__logo"
              fallbackClassName="orange-footer__name"
            />
          ) : (
            <p className="orange-footer__name">{brand.name}</p>
          )}
          {brand.tagline ? (
            <p className="orange-footer__tagline">{brand.tagline}</p>
          ) : null}
          {footer.description ? (
            <p className="orange-footer__desc">{footer.description}</p>
          ) : null}
        </div>

        <nav className="orange-footer__nav" aria-label={dict.a11y.footerNav}>
          <p className="orange-footer__heading">{dict.footer.navigation}</p>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="orange-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {whatsappHref ||
        contact.phoneHref ||
        contact.emailHref ||
        contact.location ||
        social.facebookUrl ||
        social.instagramUrl ? (
          <div>
            <p className="orange-footer__heading">{dict.footer.contact}</p>
            <ul className="orange-footer__contact">
              {whatsappHref ? (
                <li>
                  <a
                    href={whatsappHref}
                    className="orange-footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dict.whatsapp.footer}
                  </a>
                </li>
              ) : null}
              {contact.phoneHref && contact.phone ? (
                <li>
                  <a href={contact.phoneHref} className="orange-footer__link">
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact.emailHref && contact.email ? (
                <li>
                  <a href={contact.emailHref} className="orange-footer__link">
                    {contact.email}
                  </a>
                </li>
              ) : null}
              {contact.location ? (
                <li className="orange-footer__location">{contact.location}</li>
              ) : null}
            </ul>
            {social.facebookUrl || social.instagramUrl ? (
              <nav
                aria-label={dict.a11y.socialNav}
                className="orange-footer__social"
              >
                {social.facebookUrl ? (
                  <a
                    href={social.facebookUrl}
                    className="orange-footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={dict.social.facebook}
                  >
                    <OrangeIconFacebook className="h-5 w-5" />
                    <span>{dict.social.facebook}</span>
                  </a>
                ) : null}
                {social.instagramUrl ? (
                  <a
                    href={social.instagramUrl}
                    className="orange-footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={dict.social.instagram}
                  >
                    <OrangeIconInstagram className="h-5 w-5" />
                    <span>{dict.social.instagram}</span>
                  </a>
                ) : null}
              </nav>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="orange-footer__bottom">
        <p>
          {fillTemplate(dict.footer.copyright, {
            year,
            name: brand.name,
          })}
        </p>
        <nav aria-label={dict.a11y.legalNav} className="orange-footer__legal">
          <Link
            href={localizeSiteHref(legal.privacyNoticeUrl, locale, defaultLocale)}
            className="orange-footer__link"
          >
            {dict.footer.privacy}
          </Link>
          <Link
            href={localizeSiteHref(legal.termsUrl, locale, defaultLocale)}
            className="orange-footer__link"
          >
            {dict.footer.terms}
          </Link>
          {legal.cookiesUrl ? (
            <Link
              href={localizeSiteHref(legal.cookiesUrl, locale, defaultLocale)}
              className="orange-footer__link"
            >
              {dict.footer.cookies}
            </Link>
          ) : null}
        </nav>
        {quote ? <p className="orange-signature orange-footer__quote">{quote}</p> : null}
        {footer.showPoweredBy ? (
          <p className="orange-footer__powered">
            {dict.footer.poweredBy}{" "}
            <Link href="https://evenia.mx" rel="noopener noreferrer">
              Evenia
            </Link>
          </p>
        ) : null}
      </div>
    </footer>
  );
}
