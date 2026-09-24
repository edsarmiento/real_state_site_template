import Link from "next/link";
import { Suspense } from "react";
import { getSessionContext } from "@/lib/session-context";
import { localizedHref } from "@/lib/site-i18n";
import { elegantContactChannels } from "@/themes/elegant/elegant-contact-channels";
import { ElegantHeaderChrome } from "@/themes/elegant/elegant-header-chrome";
import { ElegantHeaderNav } from "@/themes/elegant/elegant-header-nav";
import { ElegantIconWhatsApp } from "@/themes/elegant/elegant-icons";
import { ElegantLocaleSwitcher } from "@/themes/elegant/elegant-locale-switcher";
import { ElegantLogo } from "@/themes/elegant/elegant-logo";
import { ElegantMobileNav } from "@/themes/elegant/elegant-mobile-nav";
import {
  elegantBrandInitials,
  elegantNavLinks,
  loadElegantUi,
} from "@/themes/elegant/elegant-ui";

type Props = {
  lang?: string;
};

export async function ElegantHeader({ lang }: Props) {
  const [ui, session] = await Promise.all([
    loadElegantUi(lang),
    getSessionContext(),
  ]);
  const { content, dict, locale, defaultLocale } = ui;
  const isAdmin = session?.isStaffUser === true;
  const { brand } = content;
  const links = elegantNavLinks(dict, locale, defaultLocale);
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const whatsappHref = elegantContactChannels(content).whatsappHref;
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
  const initials = elegantBrandInitials(brand.name);

  return (
    <ElegantHeaderChrome
      brand={
        <Link href={homeHref} className="elegant-brand">
          {brand.logoUrl ? (
            <ElegantLogo
              src={brand.logoUrl}
              alt={brand.name}
              className="elegant-brand__logo"
              fallbackClassName="elegant-brand__name"
            />
          ) : (
            <>
              <span className="elegant-brand__mark" aria-hidden>
                {initials}
              </span>
              <span className="elegant-brand__name">{brand.name}</span>
            </>
          )}
        </Link>
      }
      nav={<ElegantHeaderNav links={links} label={dict.a11y.primaryNav} />}
      tools={
        <div className="elegant-header__actions">
          <Suspense fallback={null}>
            <ElegantLocaleSwitcher {...switcherProps} />
          </Suspense>
          {whatsapp ? (
            <a
              href={whatsapp.href}
              className="elegant-btn elegant-btn--gold elegant-header__cta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsapp.ariaLabel}
            >
              <ElegantIconWhatsApp className="h-4 w-4" />
              <span>{whatsapp.label}</span>
            </a>
          ) : null}
          <Link
            href={isAdmin ? "/listings" : "/login"}
            className="elegant-btn elegant-btn--ghost elegant-header__access"
          >
            {isAdmin ? dict.admin.manage : dict.admin.signIn}
          </Link>
          <ElegantMobileNav
            links={links}
            whatsapp={whatsapp}
            menuLabel={dict.a11y.primaryNav}
            openLabel={dict.a11y.openMenu}
            closeLabel={dict.a11y.closeMenu}
            localeSwitcher={
              <Suspense fallback={null}>
                <ElegantLocaleSwitcher {...switcherProps} />
              </Suspense>
            }
          />
        </div>
      }
    />
  );
}
