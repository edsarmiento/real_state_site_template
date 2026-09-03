import Link from "next/link";
import { Suspense } from "react";
import { localizedHref } from "@/lib/site-i18n";
import { beigeContactChannels } from "@/themes/beige/beige-contact-channels";
import { getBeigeCopy } from "@/themes/beige/beige-copy";
import {
  BEIGE_LOGO_NAV_CLASS,
  formatBeigePhoneDisplay,
} from "@/themes/beige/beige-display";
import { BeigeHeaderChrome } from "@/themes/beige/beige-header-chrome";
import {
  BeigeIconMail,
  BeigeIconPhone,
  BeigeIconWhatsApp,
} from "@/themes/beige/beige-icons";
import { BeigeLocaleSwitcher } from "@/themes/beige/beige-locale-switcher";
import { BeigeLogo } from "@/themes/beige/beige-logo";
import { BeigeMobileNav } from "@/themes/beige/beige-mobile-nav";
import { BeigeSocialLinks } from "@/themes/beige/beige-social-links";
import { beigeNavLinks, getBeigeUi } from "@/themes/beige/beige-ui";

type Props = {
  lang?: string;
  variant?: "home" | "detail";
};

export async function BeigeHeader({
  lang,
  variant = "home",
}: Props) {
  const { content, dict, locale, defaultLocale } = await getBeigeUi(lang);
  const copy = getBeigeCopy(locale);
  const { brand, social } = content;
  const links = beigeNavLinks(dict, locale, defaultLocale);
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const contactHref = localizedHref("/#contacto", locale, null, defaultLocale);
  const channels = beigeContactChannels(content);
  const whatsappHref = channels.whatsappHref;
  const whatsappNumber = channels.whatsappNumber;
  const officePhone = channels.phone;
  const officeHref = channels.phoneHref;
  const email = content.contact.email;
  const emailHref = content.contact.emailHref;
  const showWhatsApp = Boolean(whatsappHref && whatsappNumber);
  const showOffice = Boolean(officePhone && officeHref);
  const showEmail = Boolean(email && emailHref);
  const hasSocial = Boolean(social.instagramUrl || social.facebookUrl);
  const showContactCluster = showWhatsApp || showOffice;
  const showTopBar = showContactCluster || showEmail || hasSocial;
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
  const mutedClass = light ? "text-[#2D2A26]" : "text-white/90";
  const ctaClass = light
    ? "beige-btn hidden items-center gap-2 rounded-full bg-[#A4B494] px-6 py-3.5 text-sm font-medium text-white shadow-md lg:inline-flex"
    : "beige-btn hidden items-center gap-2 rounded-full bg-[#A4B494] px-6 py-3.5 text-sm font-medium text-[#2D2A26] shadow-md lg:inline-flex";

  const whatsappLabel = whatsappNumber
    ? `${copy.whatsappPrefix}: ${formatBeigePhoneDisplay(whatsappNumber)}`
    : copy.whatsappPrefix;
  const officeLabel = officePhone
    ? `${copy.officeLabel}: ${formatBeigePhoneDisplay(officePhone)}`
    : copy.officeLabel;

  const topBar = showTopBar ? (
    <div className="beige-topbar">
      <div className="beige-topbar__inner">
        <div className="beige-topbar__cluster">
          {showContactCluster ? (
            <span className="beige-topbar__kicker">{copy.attentionKicker}</span>
          ) : null}
          {showContactCluster ? (
            <span className="beige-topbar__sep beige-topbar__sep--kicker" aria-hidden />
          ) : null}
          {showWhatsApp && whatsappHref && whatsappNumber ? (
            <a
              href={whatsappHref}
              className="beige-topbar__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${whatsappLabel}. ${dict.a11y.opensInNewTab}`}
              title={whatsappLabel}
            >
              <BeigeIconWhatsApp className="beige-topbar__icon" />
              <span className="beige-topbar__text">
                {formatBeigePhoneDisplay(whatsappNumber)}
              </span>
            </a>
          ) : null}
          {showWhatsApp && showOffice ? (
            <span className="beige-topbar__sep" aria-hidden />
          ) : null}
          {showOffice && officeHref && officePhone ? (
            <a
              href={officeHref}
              className="beige-topbar__link"
              aria-label={officeLabel}
              title={officeLabel}
            >
              <BeigeIconPhone className="beige-topbar__icon" />
              <span className="beige-topbar__text">
                {formatBeigePhoneDisplay(officePhone)}
              </span>
            </a>
          ) : null}
        </div>
        <div className="beige-topbar__meta">
          {showEmail && emailHref && email ? (
            <a href={emailHref} className="beige-topbar__email" title={email}>
              <BeigeIconMail className="beige-topbar__icon" />
              <span>{email}</span>
            </a>
          ) : null}
          {showEmail && hasSocial ? (
            <span className="beige-topbar__sep beige-topbar__sep--meta" aria-hidden />
          ) : null}
          {hasSocial ? (
            <BeigeSocialLinks social={social} dict={dict} variant="compact" />
          ) : null}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <BeigeHeaderChrome
      light={light}
      topBar={topBar}
      brand={
        <Link href={homeHref} className="beige-logo-link min-w-0 shrink-0">
          {brand.logoUrl ? (
            <BeigeLogo
              src={brand.logoUrl}
              alt={brand.name}
              className={BEIGE_LOGO_NAV_CLASS}
              fallbackClassName="text-2xl font-medium uppercase tracking-[0.2em]"
            />
          ) : (
            <span className="beige-serif block text-2xl uppercase tracking-[0.2em]">
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
      }
      nav={
        <nav
          className={`hidden items-center space-x-8 text-sm font-medium tracking-wide lg:flex ${mutedClass}`}
          aria-label={dict.a11y.primaryNav}
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="beige-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>
      }
      tools={
        <div className="flex items-center gap-3">
          <Suspense fallback={null}>
            <BeigeLocaleSwitcher {...switcherProps} />
          </Suspense>
          <Link href={contactHref} className={ctaClass}>
            {copy.contactCta}
          </Link>
          <BeigeMobileNav
            links={links}
            contactCta={{ href: contactHref, label: copy.contactCta }}
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
      }
    />
  );
}
