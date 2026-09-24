import Link from "next/link";
import { Suspense } from "react";
import { localizedHref } from "@/lib/site-i18n";
import { getSessionContext } from "@/lib/session-context";
import { ultraContactChannels } from "@/themes/ultra/ultra-contact-channels";
import { UltraIconWhatsApp } from "@/themes/ultra/ultra-icons";
import { UltraHeaderChrome } from "@/themes/ultra/ultra-header-chrome";
import { UltraLocaleSwitcher } from "@/themes/ultra/ultra-locale-switcher";
import { UltraMobileNav } from "@/themes/ultra/ultra-mobile-nav";
import { loadUltraUi, ultraNavLinks } from "@/themes/ultra/ultra-ui";

type Props = {
  lang?: string;
};

export async function UltraHeader({ lang }: Props) {
  const [ui, session] = await Promise.all([
    loadUltraUi(lang),
    getSessionContext(),
  ]);
  const { content, dict, locale, defaultLocale } = ui;
  const { brand } = content;
  const links = ultraNavLinks(dict, locale, defaultLocale);
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const whatsappHref = ultraContactChannels(content).whatsappHref;
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
    } as const,
  };
  const isAdmin = session?.isStaffUser === true;
  const initial = brand.name.trim().charAt(0).toUpperCase() || "·";

  return (
    <UltraHeaderChrome>
      <div className="ultra-header__bar">
        <Link href={homeHref} className="ultra-logo-link">
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="ultra-logo"
            />
          ) : (
            <>
              <span className="ultra-logo-mark" aria-hidden>
                {initial}
              </span>
              <span className="ultra-logo-fallback">{brand.name}</span>
            </>
          )}
        </Link>

        <nav className="ultra-header__nav" aria-label={dict.a11y.primaryNav}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="ultra-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ultra-header__actions">
          <Suspense fallback={null}>
            <UltraLocaleSwitcher {...switcherProps} />
          </Suspense>
          {whatsapp ? (
            <a
              href={whatsapp.href}
              className="ultra-whatsapp-cta ultra-whatsapp-cta--desktop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsapp.ariaLabel}
            >
              <UltraIconWhatsApp className="ultra-whatsapp-cta__icon" />
              <span>{whatsapp.label}</span>
            </a>
          ) : null}
          <Link
            href={isAdmin ? "/listings" : "/login"}
            className="ultra-btn ultra-btn--ghost ultra-header__admin"
          >
            {isAdmin ? dict.admin.manage : dict.admin.signIn}
          </Link>
          <UltraMobileNav
            links={links}
            whatsapp={whatsapp}
            menuLabel={dict.a11y.primaryNav}
            openLabel={dict.a11y.openMenu}
            closeLabel={dict.a11y.closeMenu}
            localeSwitcher={
              <Suspense fallback={null}>
                <UltraLocaleSwitcher {...switcherProps} />
              </Suspense>
            }
          />
        </div>
      </div>
    </UltraHeaderChrome>
  );
}
