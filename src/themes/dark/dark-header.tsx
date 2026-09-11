import Link from "next/link";
import { Suspense } from "react";
import { localizedHref } from "@/lib/site-i18n";
import { darkBrandMonogram, getDarkCopy } from "@/themes/dark/dark-copy";
import { darkContactChannels } from "@/themes/dark/dark-contact-channels";
import { DarkHeaderChrome } from "@/themes/dark/dark-header-chrome";
import { DarkHeaderNav } from "@/themes/dark/dark-header-nav";
import { DarkIconWhatsApp } from "@/themes/dark/dark-icons";
import { DarkLocaleSwitcher } from "@/themes/dark/dark-locale-switcher";
import { darkLocaleSwitcherVisible } from "@/themes/dark/dark-locale-visibility";
import { DarkLogo } from "@/themes/dark/dark-logo";
import { DarkMobileNav } from "@/themes/dark/dark-mobile-nav";
import { darkNavLinks, type DarkUi } from "@/themes/dark/dark-ui";

type Props = {
  ui: DarkUi;
  isAdmin?: boolean;
};

export function DarkHeader({ ui, isAdmin = false }: Props) {
  const { content, dict, locale, defaultLocale } = ui;
  const { brand } = content;
  const links = darkNavLinks(dict, locale, defaultLocale);
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const whatsappHref = darkContactChannels(content).whatsappHref;
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
  const showLocale = darkLocaleSwitcherVisible(
    switcherProps.showLocaleSwitcher,
    switcherProps.supportedLocales,
  );
  const copy = getDarkCopy(locale);
  const monogram = darkBrandMonogram(brand.name, copy.brandMarkFallback);

  return (
    <DarkHeaderChrome>
      <div className="dark-header__bar">
        <Link href={homeHref} className="dark-logo-link">
          {brand.logoUrl ? (
            <DarkLogo
              src={brand.logoUrl}
              alt={brand.name}
              className="dark-logo--nav"
              fallbackClassName="dark-logo-fallback"
            />
          ) : (
            <>
              <span className="dark-logo-mark" aria-hidden>
                {monogram}
              </span>
              <span className="dark-logo-copy">
                <span className="dark-logo-fallback">{brand.name}</span>
                {brand.tagline ? (
                  <span className="dark-logo-tagline">{brand.tagline}</span>
                ) : null}
              </span>
            </>
          )}
        </Link>

        <DarkHeaderNav links={links} label={dict.a11y.primaryNav} />

        <div className="dark-header__actions">
          {showLocale ? (
            <Suspense fallback={null}>
              <DarkLocaleSwitcher {...switcherProps} />
            </Suspense>
          ) : null}
          {whatsapp ? (
            <a
              href={whatsapp.href}
              className="dark-whatsapp-cta dark-whatsapp-cta--desktop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsapp.ariaLabel}
            >
              <DarkIconWhatsApp className="dark-whatsapp-cta__icon" />
              <span>{whatsapp.label}</span>
            </a>
          ) : null}
          <Link
            href={isAdmin ? "/listings" : "/login"}
            className="dark-header__admin"
          >
            {isAdmin ? dict.admin.manage : dict.admin.signIn}
          </Link>
          <DarkMobileNav
            links={links}
            whatsapp={whatsapp}
            menuLabel={dict.a11y.primaryNav}
            openLabel={dict.a11y.openMenu}
            closeLabel={dict.a11y.closeMenu}
            localeSwitcher={
              showLocale ? (
                <Suspense fallback={null}>
                  <DarkLocaleSwitcher {...switcherProps} />
                </Suspense>
              ) : null
            }
          />
        </div>
      </div>
    </DarkHeaderChrome>
  );
}
