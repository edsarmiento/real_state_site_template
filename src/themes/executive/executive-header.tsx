import Link from "next/link";
import { Suspense } from "react";
import { getSessionContext } from "@/lib/session-context";
import { localizedHref } from "@/lib/site-i18n";
import { executiveContactChannels } from "@/themes/executive/executive-contact-channels";
import { ExecutiveIconWhatsApp } from "@/themes/executive/executive-icons";
import { ExecutiveLocaleSwitcher } from "@/themes/executive/executive-locale-switcher";
import { ExecutiveLogo } from "@/themes/executive/executive-logo";
import { ExecutiveMobileNav } from "@/themes/executive/executive-mobile-nav";
import {
  executiveBrandInitial,
  executiveNavLinks,
  loadExecutiveUi,
} from "@/themes/executive/executive-ui";

type Props = {
  lang?: string;
};

export async function ExecutiveHeader({ lang }: Props) {
  const [{ content, dict, locale, defaultLocale }, session] = await Promise.all([
    loadExecutiveUi(lang),
    getSessionContext(),
  ]);
  const { brand } = content;
  const links = executiveNavLinks(dict, locale, defaultLocale);
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const whatsappHref = executiveContactChannels(content).whatsappHref;
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
  const initial = executiveBrandInitial(brand.name);
  const isAdmin = session?.isStaffUser === true;
  const access = {
    href: isAdmin ? "/listings" : "/login",
    label: isAdmin ? dict.admin.manage : dict.admin.signIn,
  };

  return (
    <header className="executive-header">
      <div className="executive-header__inner">
        <Link href={homeHref} className="executive-brand">
          {brand.logoUrl ? (
            <ExecutiveLogo
              key={brand.logoUrl}
              src={brand.logoUrl}
              alt={brand.name}
              className="executive-logo--nav"
              fallback={initial}
            />
          ) : (
            <span className="executive-mark" aria-hidden>
              {initial}
            </span>
          )}
          <span className="executive-brand__text">
            <span className="executive-brand__name">{brand.name}</span>
            {brand.tagline ? (
              <span className="executive-brand__tagline">{brand.tagline}</span>
            ) : null}
          </span>
        </Link>

        <nav className="executive-header__nav" aria-label={dict.a11y.primaryNav}>
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                index === 0
                  ? "executive-nav-link is-featured"
                  : "executive-nav-link"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="executive-header__tools">
          <Suspense fallback={null}>
            <ExecutiveLocaleSwitcher {...switcherProps} />
          </Suspense>
          {whatsapp ? (
            <a
              href={whatsapp.href}
              className="executive-whatsapp-cta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsapp.ariaLabel}
            >
              <ExecutiveIconWhatsApp className="executive-whatsapp-cta__icon" />
              <span>{whatsapp.label}</span>
            </a>
          ) : null}
          <Link href={access.href} className="executive-access-cta">
            {access.label}
          </Link>
          <ExecutiveMobileNav
            links={links}
            whatsapp={whatsapp}
            access={access}
            menuLabel={dict.a11y.primaryNav}
            openLabel={dict.a11y.openMenu}
            closeLabel={dict.a11y.closeMenu}
            localeSwitcher={
              <Suspense fallback={null}>
                <ExecutiveLocaleSwitcher {...switcherProps} />
              </Suspense>
            }
          />
        </div>
      </div>
    </header>
  );
}
