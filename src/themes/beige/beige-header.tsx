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
  const navClass = light ? "beige-glass-nav--light" : "beige-glass-nav";
  const textClass = light ? "text-[#2D2A26]" : "text-[#FBF9F5]";
  const mutedClass = light ? "text-[#8A7759]" : "text-[#E5D9C5]";

  return (
    <header className="sticky top-0 z-50">
      {contact.phone || whatsappHref ? (
        <div
          className={`hidden items-center justify-end gap-6 px-6 py-2 text-xs tracking-wider sm:flex ${
            light ? "bg-[#F4EFE6] text-[#8A7759]" : "bg-[#2D2A26] text-[#E5D9C5]"
          }`}
        >
          {contact.phone && contact.phoneHref ? (
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-1.5"
            >
              <BeigeIconPhone className="h-3.5 w-3.5" />
              {contact.phone}
            </a>
          ) : null}
          {whatsapp ? (
            <a
              href={whatsapp.href}
              className="inline-flex items-center gap-1.5"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsapp.ariaLabel}
            >
              <BeigeIconWhatsApp className="h-3.5 w-3.5" />
              {whatsapp.label}
            </a>
          ) : null}
        </div>
      ) : null}

      <div className={`relative ${navClass} ${textClass}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href={homeHref} className="beige-brand min-w-0 shrink-0">
            {brand.logoUrl ? (
              <BeigeLogo
                src={brand.logoUrl}
                alt={brand.name}
                className="h-8 w-auto max-w-[10rem] object-contain"
                fallbackClassName="text-lg font-medium tracking-wide"
              />
            ) : (
              <span className="text-lg font-medium tracking-wide">
                {brand.name}
              </span>
            )}
          </Link>

          <nav
            className={`hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.14em] lg:flex ${mutedClass}`}
            aria-label={dict.a11y.primaryNav}
          >
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="beige-nav-link pb-0.5">
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
                className="hidden items-center gap-2 rounded-full bg-[#A4B494] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#2D2A26] sm:inline-flex"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={whatsapp.ariaLabel}
              >
                <BeigeIconWhatsApp className="h-4 w-4" />
                {dict.nav.contact}
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
