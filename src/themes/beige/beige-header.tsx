import Link from "next/link";
import { Suspense } from "react";
import { localizedHref } from "@/lib/site-i18n";
import {
  BeigeIconPhone,
  BeigeIconWhatsApp,
} from "@/themes/beige/beige-icons";
import { BeigeLocaleSwitcher } from "@/themes/beige/beige-locale-switcher";
import { BeigeLogo } from "@/themes/beige/beige-logo";
import { BeigeMobileNav } from "@/themes/beige/beige-mobile-nav";
import { beigeNavLinks, getBeigeUi } from "@/themes/beige/beige-ui";

type Props = {
  lang?: string;
  variant?: "home" | "detail";
};

export async function BeigeHeader({ lang, variant = "home" }: Props) {
  const { content, dict, locale, defaultLocale } = await getBeigeUi(lang);
  const { brand, contact } = content;
  const links = beigeNavLinks(dict, locale, defaultLocale);
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
    } as const,
  };
  const light = variant === "detail";
  const navClass = light
    ? "beige-glass-nav--light border-b border-[#E5D9C5]/60"
    : "beige-glass-nav border-b border-white/10";
  const textClass = light ? "text-[#2D2A26]" : "text-white";
  const mutedClass = light ? "text-[#2D2A26]" : "text-white/90";
  const ctaClass = light
    ? "beige-btn hidden items-center gap-2 rounded-full bg-[#A4B494] px-6 py-3.5 text-sm font-medium text-white shadow-md xl:inline-flex"
    : "beige-btn hidden items-center gap-2 rounded-full bg-[#A4B494] px-6 py-3.5 text-sm font-medium text-[#2D2A26] shadow-md xl:inline-flex";

  return (
    <header className="sticky top-0 z-50">
      {contact.phone || whatsappHref ? (
        <div
          className={`hidden border-b px-6 py-2.5 text-xs tracking-wide lg:block ${
            light
              ? "border-[#E5D9C5] bg-[#2D2A26] text-[#F4EFE6]"
              : "border-white/10 bg-[#2D2A26] text-[#F4EFE6]"
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {whatsapp ? (
              <a
                href={whatsapp.href}
                className="inline-flex items-center gap-2 transition-colors hover:text-[#C4D3A2]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={whatsapp.ariaLabel}
              >
                <BeigeIconWhatsApp className="h-3.5 w-3.5 text-[#A4B494]" />
                {whatsapp.label}
              </a>
            ) : (
              <span />
            )}
            {contact.phone && contact.phoneHref ? (
              <a
                href={contact.phoneHref}
                className="inline-flex items-center gap-1.5 font-medium text-[#C4D3A2]"
              >
                <BeigeIconPhone className="h-3.5 w-3.5" />
                {contact.phone}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className={`relative ${navClass} ${textClass}`}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 xl:h-24">
          <Link href={homeHref} className="beige-brand min-w-0 shrink-0">
            {brand.logoUrl ? (
              <BeigeLogo
                src={brand.logoUrl}
                alt={brand.name}
                className="h-10 w-auto max-w-[12rem] object-contain"
                fallbackClassName="text-2xl font-medium uppercase tracking-[0.2em]"
              />
            ) : (
              <span className="block text-2xl uppercase tracking-[0.2em]">
                {brand.name}
                {brand.tagline ? (
                  <span
                    className={`mt-0.5 block font-sans text-[9px] font-light tracking-[0.3em] ${
                      light ? "text-[#A39073]" : "text-[#A4B494]"
                    }`}
                  >
                    {brand.tagline}
                  </span>
                ) : null}
              </span>
            )}
          </Link>

          <nav
            className={`hidden items-center space-x-7 text-sm font-medium tracking-wide xl:flex ${mutedClass}`}
            aria-label={dict.a11y.primaryNav}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="beige-nav-link py-2 hover:text-[#A4B494]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Suspense fallback={null}>
              <BeigeLocaleSwitcher {...switcherProps} />
            </Suspense>
            {whatsapp ? (
              <a
                href={whatsapp.href}
                className={ctaClass}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${dict.nav.listProperty}. ${dict.a11y.opensInNewTab}`}
              >
                {dict.nav.listProperty}
              </a>
            ) : null}
            <BeigeMobileNav
              links={links}
              whatsapp={whatsapp}
              menuLabel={dict.a11y.primaryNav}
              openLabel={dict.a11y.openMenu}
              closeLabel={dict.a11y.closeMenu}
              light={light}
              localeSwitcher={
                <Suspense fallback={null}>
                  <BeigeLocaleSwitcher {...switcherProps} />
                </Suspense>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}
