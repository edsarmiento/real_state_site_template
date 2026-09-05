"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { PublicSocialLinks } from "@/lib/public-site-content";
import type { SiteDictionary } from "@/lib/site-i18n";
import { LuxurySocialLinks } from "@/themes/luxury/luxury-social-links";
import { LuxuryWhatsAppLink } from "@/themes/luxury/luxury-whatsapp-link";

type NavLink = {
  href: string;
  label: string;
};

type WhatsAppLink = {
  href: string;
  label: string;
  ariaLabel?: string;
};

type Props = {
  links: NavLink[];
  whatsapp: WhatsAppLink | null;
  menuLabel: string;
  openLabel: string;
  closeLabel: string;
  localeSwitcher?: ReactNode;
  social?: PublicSocialLinks;
  dict: SiteDictionary;
};

export function LuxuryMobileNav({
  links,
  whatsapp,
  menuLabel,
  openLabel,
  closeLabel,
  localeSwitcher,
  social,
  dict,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    setOpen((value) => !value);
  }

  return (
    <div className="luxury-mobile-nav">
      <button
        ref={toggleRef}
        type="button"
        className="luxury-mobile-nav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
        <span className="luxury-mobile-nav__bars" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="luxury-mobile-nav__backdrop"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
          />
          <nav
            id={panelId}
            className="luxury-mobile-nav__panel"
            aria-label={menuLabel}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="luxury-mobile-nav__link"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {localeSwitcher ? (
              <div className="luxury-mobile-nav__locale">{localeSwitcher}</div>
            ) : null}
            {whatsapp ? (
              <LuxuryWhatsAppLink
                href={whatsapp.href}
                className="luxury-whatsapp-cta--panel"
                ariaLabel={whatsapp.ariaLabel}
                onClick={() => setOpen(false)}
              >
                {whatsapp.label}
              </LuxuryWhatsAppLink>
            ) : null}
            {social ? (
              <LuxurySocialLinks
                social={social}
                dict={dict}
                heading={dict.footer.follow}
              />
            ) : null}
          </nav>
        </>
      ) : null}
    </div>
  );
}
