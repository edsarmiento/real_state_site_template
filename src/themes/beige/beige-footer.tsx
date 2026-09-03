import Link from "next/link";
import { fillTemplate, localizeSiteHref } from "@/lib/site-i18n";
import { BeigeLogo } from "@/themes/beige/beige-logo";
import { beigeNavLinks, getBeigeUi } from "@/themes/beige/beige-ui";

type Props = {
  lang?: string;
};

export async function BeigeFooter({ lang }: Props) {
  const { content, dict, locale, defaultLocale } = await getBeigeUi(lang);
  const { brand, contact, footer, legal, social } = content;
  const links = beigeNavLinks(dict, locale, defaultLocale);
  const whatsappHref = content.whatsapp.href ?? contact.whatsappHref;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2D2A26] text-[#E5D9C5]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          {brand.logoUrl ? (
            <BeigeLogo
              src={brand.logoUrl}
              alt={brand.name}
              className="mb-4 h-9 w-auto max-w-[12rem] object-contain brightness-0 invert"
              fallbackClassName="beige-serif mb-4 text-xl text-[#FBF9F5]"
            />
          ) : (
            <p className="beige-serif mb-4 text-xl text-[#FBF9F5]">{brand.name}</p>
          )}
          <p className="text-sm leading-relaxed text-[#A39073]">
            {process.env.SITE_FOOTER_DESCRIPTION?.trim() || dict.footer.description}
          </p>
        </div>

        <nav aria-label={dict.a11y.footerNav}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#FBF9F5]">
            {dict.footer.navigation}
          </p>
          <ul className="space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[#C4D3A2]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#FBF9F5]">
            {dict.footer.contact}
          </p>
          <ul className="space-y-2 text-sm">
            {whatsappHref ? (
              <li>
                <a
                  href={whatsappHref}
                  className="hover:text-[#C4D3A2]"
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
                <a href={contact.emailHref} className="hover:text-[#C4D3A2]">
                  {contact.email}
                </a>
              </li>
            ) : null}
            {contact.phoneHref && contact.phone ? (
              <li>
                <a href={contact.phoneHref} className="hover:text-[#C4D3A2]">
                  {contact.phone}
                </a>
              </li>
            ) : null}
            {contact.location ? <li>{contact.location}</li> : null}
          </ul>
          {social.instagramUrl || social.facebookUrl ? (
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#FBF9F5]">
              {dict.footer.follow}
            </p>
          ) : null}
          <div className="mt-2 flex gap-3 text-sm">
            {social.instagramUrl ? (
              <a
                href={social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C4D3A2]"
              >
                {dict.social.instagram}
              </a>
            ) : null}
            {social.facebookUrl ? (
              <a
                href={social.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C4D3A2]"
              >
                {dict.social.facebook}
              </a>
            ) : null}
          </div>
        </div>

        <nav aria-label={dict.a11y.legalNav}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#FBF9F5]">
            {dict.footer.legal}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href={localizeSiteHref(
                  legal.privacyNoticeUrl,
                  locale,
                  defaultLocale,
                )}
                className="hover:text-[#C4D3A2]"
              >
                {dict.footer.privacy}
              </Link>
            </li>
            <li>
              <Link
                href={localizeSiteHref(legal.termsUrl, locale, defaultLocale)}
                className="hover:text-[#C4D3A2]"
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
                  className="hover:text-[#C4D3A2]"
                >
                  {dict.footer.cookies}
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-[#A39073]">
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
