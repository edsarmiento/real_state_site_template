import Link from "next/link";
import { Suspense } from "react";
import { getSessionContext } from "@/lib/session-context";
import { localizedHref } from "@/lib/site-i18n";
import { publicContactChannels as beigeContactChannels } from "@/lib/public-contact-channels";
import { BEIGE_LOGO_NAV_CLASS } from "@/themes/beige/beige-display";
import { BeigeHeaderChrome } from "@/themes/beige/beige-header-chrome";
import { BeigeHeaderNav } from "@/themes/beige/beige-header-nav";
import { BeigeIconWhatsApp } from "@/themes/beige/beige-icons";
import { BeigeLocaleSwitcher } from "@/themes/beige/beige-locale-switcher";
import { BeigeLogo } from "@/themes/beige/beige-logo";
import { BeigeMobileNav } from "@/themes/beige/beige-mobile-nav";
import { beigeNavLinks, loadBeigeUi } from "@/themes/beige/beige-ui";

type Props = {
  lang?: string;
};

export async function BeigeHeader({ lang }: Props) {
  const [ui, session] = await Promise.all([
    loadBeigeUi(lang),
    getSessionContext(),
  ]);
  const { content, dict, locale, defaultLocale } = ui;
  const isAdmin = session?.isStaffUser === true;
  const { brand } = content;
  const links = beigeNavLinks(dict, locale, defaultLocale);
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const whatsappHref = beigeContactChannels(content).whatsappHref;
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

  return (
    <BeigeHeaderChrome
      brand={
        <Link href={homeHref} className="beige-logo-link">
          {brand.logoUrl ? (
            <BeigeLogo
              src={brand.logoUrl}
              alt={brand.name}
              className={BEIGE_LOGO_NAV_CLASS}
              fallbackClassName="beige-logo-fallback"
            />
          ) : (
            <span className="beige-logo-fallback">{brand.name}</span>
          )}
        </Link>
      }
      nav={
        <BeigeHeaderNav links={links} label={dict.a11y.primaryNav} />
      }
      tools={
        <div className="beige-header__actions">
          <Suspense fallback={null}>
            <BeigeLocaleSwitcher {...switcherProps} />
          </Suspense>
          {whatsapp ? (
            <a
              href={whatsapp.href}
              className="beige-whatsapp-cta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsapp.ariaLabel}
            >
              <BeigeIconWhatsApp className="beige-whatsapp-cta__icon" />
              <span>{whatsapp.label}</span>
            </a>
          ) : null}
          <Link
            href={isAdmin ? "/listings" : "/login"}
            className="beige-btn beige-btn--ghost beige-header__admin"
          >
            {isAdmin ? dict.admin.manage : dict.admin.signIn}
          </Link>
          <BeigeMobileNav
            links={links}
            whatsapp={whatsapp}
            menuLabel={dict.a11y.primaryNav}
            openLabel={dict.a11y.openMenu}
            closeLabel={dict.a11y.closeMenu}
            localeSwitcher={
              <Suspense fallback={null}>
                <BeigeLocaleSwitcher {...switcherProps} />
              </Suspense>
            }
          />
        </div>
      }
    />
  );
}
