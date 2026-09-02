import Link from "next/link";
import { Suspense } from "react";
import { localizedHref } from "@/lib/site-i18n";
import { LuxuryLocaleSwitcher } from "@/themes/luxury/luxury-locale-switcher";
import { LuxuryLogo } from "@/themes/luxury/luxury-logo";
import { LuxuryMobileNav } from "@/themes/luxury/luxury-mobile-nav";
import { getLuxuryUi, luxuryNavLinks } from "@/themes/luxury/luxury-ui";
import { LuxuryWhatsAppLink } from "@/themes/luxury/luxury-whatsapp-link";

type Props = {
  lang?: string;
};

export async function LuxuryHeader({ lang }: Props) {
  const { content, dict, locale, defaultLocale } = await getLuxuryUi(lang);
  const { brand, contact, social } = content;
  const links = luxuryNavLinks(dict, locale, defaultLocale);
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const whatsappHref = content.whatsapp.href ?? contact.whatsappHref;
  const whatsapp = whatsappHref
    ? {
        href: whatsappHref,
        label: dict.whatsapp.label,
        ariaLabel: `${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`,
      }
    : null;
  const switcherProps = {
    locale,
    defaultLocale,
    supportedLocales: content.locale.supportedLocales,
    showLocaleSwitcher: content.locale.showLocaleSwitcher,
    label: dict.localeSwitcher.label,
    optionNames: {
      es: dict.localeSwitcher.esName,
      en: dict.localeSwitcher.enName,
    },
  };

  return (
    <header className="luxury-header">
      <div className="luxury-header__inner">
        <Link href={homeHref} className="luxury-header__brand">
          {brand.logoUrl ? (
            <LuxuryLogo
              src={brand.logoUrl}
              alt={brand.name}
              className="luxury-header__logo"
              fallbackClassName="luxury-header__name"
            />
          ) : (
            <span className="luxury-header__name">{brand.name}</span>
          )}
        </Link>

        <nav className="luxury-header__nav" aria-label={dict.a11y.primaryNav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="luxury-header__link"
            >
              {link.label}
            </Link>
          ))}
          <Suspense fallback={null}>
            <LuxuryLocaleSwitcher {...switcherProps} />
          </Suspense>
        </nav>

        <div className="luxury-header__tools">
          {whatsapp ? (
            <LuxuryWhatsAppLink
              href={whatsapp.href}
              className="luxury-whatsapp-cta--nav"
              ariaLabel={whatsapp.ariaLabel}
            >
              {whatsapp.label}
            </LuxuryWhatsAppLink>
          ) : null}
          <div className="luxury-header__mobile">
            <LuxuryMobileNav
              links={links}
              whatsapp={whatsapp}
              menuLabel={dict.a11y.primaryNav}
              openLabel={dict.a11y.openMenu}
              closeLabel={dict.a11y.closeMenu}
              localeSwitcher={
                <Suspense fallback={null}>
                  <LuxuryLocaleSwitcher {...switcherProps} />
                </Suspense>
              }
              social={social}
              dict={dict}
            />
          </div>
        </div>
      </div>
    </header>
  );
}