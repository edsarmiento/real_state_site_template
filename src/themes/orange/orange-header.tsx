import Link from "next/link";
import { Suspense } from "react";
import { localizedHref } from "@/lib/site-i18n";
import { OrangeHeaderChrome } from "@/themes/orange/orange-header-chrome";
import { OrangeLocaleSwitcher } from "@/themes/orange/orange-locale-switcher";
import { OrangeLogo } from "@/themes/orange/orange-logo";
import { OrangeMobileNav } from "@/themes/orange/orange-mobile-nav";
import { loadOrangeUi, orangeNavLinks } from "@/themes/orange/orange-ui";

type Props = {
  lang?: string;
};

export async function OrangeHeader({ lang }: Props) {
  const { content, dict, copy, locale, defaultLocale } = await loadOrangeUi(lang);
  const showTestimonials = content.testimonials.length > 0;
  const showAbout = Boolean(content.about.title.trim());
  const links = orangeNavLinks({
    dict,
    copy,
    locale,
    defaultLocale,
    showServices: true,
    showTestimonials,
    showAbout,
  });
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const contactHref = localizedHref("/#contacto", locale, null, defaultLocale);
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
    <OrangeHeaderChrome>
      <div className="orange-header__inner">
        <Link href={homeHref} className="orange-brand">
          {content.brand.logoUrl ? (
            <OrangeLogo
              src={content.brand.logoUrl}
              alt={content.brand.name}
              className="orange-logo"
              fallbackClassName="orange-brand__name"
            />
          ) : (
            <span className="orange-brand__name">{content.brand.name}</span>
          )}
          {content.brand.tagline ? (
            <span className="orange-brand__tagline">{content.brand.tagline}</span>
          ) : null}
        </Link>

        <nav className="orange-nav" aria-label={dict.a11y.primaryNav}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="orange-nav__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="orange-header__tools">
          <Suspense fallback={null}>
            <OrangeLocaleSwitcher {...switcherProps} />
          </Suspense>
          <Link href={contactHref} className="orange-btn orange-btn--dark orange-header__cta">
            {copy.consultCta}
          </Link>
          <OrangeMobileNav
            links={links}
            consultHref={contactHref}
            consultLabel={copy.consultCtaShort}
            menuLabel={dict.a11y.primaryNav}
            openLabel={dict.a11y.openMenu}
            closeLabel={dict.a11y.closeMenu}
            localeSwitcher={
              <Suspense fallback={null}>
                <OrangeLocaleSwitcher {...switcherProps} />
              </Suspense>
            }
          />
        </div>
      </div>
    </OrangeHeaderChrome>
  );
}
