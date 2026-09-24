import Link from "next/link";
import { Suspense } from "react";
import { getSessionContext } from "@/lib/session-context";
import { localizedHref } from "@/lib/site-i18n";
import { yellowContactChannels } from "@/themes/yellow/yellow-contact-channels";
import {
  brandInitial,
  YELLOW_LOGO_NAV_CLASS,
} from "@/themes/yellow/yellow-display";
import { YellowIconWhatsApp } from "@/themes/yellow/yellow-icons";
import { YellowLocaleSwitcher } from "@/themes/yellow/yellow-locale-switcher";
import { YellowLogo } from "@/themes/yellow/yellow-logo";
import { YellowMobileNav } from "@/themes/yellow/yellow-mobile-nav";
import { type YellowUi, yellowNavLinks } from "@/themes/yellow/yellow-ui";

type Props = {
  ui: YellowUi;
};

export async function YellowHeader({ ui }: Props) {
  const { content, dict, locale, defaultLocale } = ui;
  const session = await getSessionContext();
  const isAdmin = session?.isStaffUser === true;
  const { brand } = content;
  const links = yellowNavLinks(dict, locale, defaultLocale);
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const whatsappHref = yellowContactChannels(content).whatsappHref;
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
  const initial = brandInitial(brand.name);

  return (
    <header className="yellow-header">
      <div className="yellow-header__inner">
        <Link href={homeHref} className="yellow-logo-link">
          {brand.logoUrl ? (
            <YellowLogo
              src={brand.logoUrl}
              alt=""
              className={YELLOW_LOGO_NAV_CLASS}
              fallbackClassName="yellow-logo-mark"
            />
          ) : (
            <span className="yellow-logo-mark" aria-hidden={Boolean(brand.name)}>
              {initial || "·"}
            </span>
          )}
          <span className="yellow-logo-copy">
            <span className="yellow-logo-name">{brand.name}</span>
            {brand.tagline ? (
              <span className="yellow-logo-tagline">{brand.tagline}</span>
            ) : null}
          </span>
        </Link>

        <nav className="yellow-header__nav" aria-label={dict.a11y.primaryNav}>
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                index === 0
                  ? "yellow-nav-link yellow-nav-link--primary"
                  : "yellow-nav-link"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="yellow-header__actions">
          <div className="yellow-header__desktop-tools">
            <Suspense fallback={null}>
              <YellowLocaleSwitcher {...switcherProps} />
            </Suspense>
            {whatsapp ? (
              <a
                href={whatsapp.href}
                className="yellow-whatsapp-cta"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={whatsapp.ariaLabel}
              >
                <YellowIconWhatsApp className="yellow-whatsapp-cta__icon" />
                <span>{whatsapp.label}</span>
              </a>
            ) : null}
            <Link href={isAdmin ? "/listings" : "/login"} className="yellow-access-cta">
              {isAdmin ? dict.admin.manage : dict.admin.signIn}
            </Link>
          </div>
          <YellowMobileNav
            links={links}
            whatsapp={whatsapp}
            access={{ href: isAdmin ? "/listings" : "/login", label: isAdmin ? dict.admin.manage : dict.admin.signIn }}
            menuLabel={dict.a11y.primaryNav}
            openLabel={dict.a11y.openMenu}
            closeLabel={dict.a11y.closeMenu}
            localeSwitcher={
              <Suspense fallback={null}>
                <YellowLocaleSwitcher {...switcherProps} />
              </Suspense>
            }
          />
        </div>
      </div>
    </header>
  );
}
