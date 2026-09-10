"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  ExecutiveIconClose,
  ExecutiveIconMenu,
  ExecutiveIconWhatsApp,
} from "@/themes/executive/executive-icons";

type NavLink = {
  href: string;
  label: string;
};

type WhatsAppCta = {
  href: string;
  label: string;
  ariaLabel: string;
};

type Props = {
  links: NavLink[];
  whatsapp: WhatsAppCta | null;
  menuLabel: string;
  openLabel: string;
  closeLabel: string;
  localeSwitcher?: ReactNode;
};

export function ExecutiveMobileNav({
  links,
  whatsapp,
  menuLabel,
  openLabel,
  closeLabel,
  localeSwitcher,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const first = panelRef.current?.querySelector<HTMLElement>(
      "a, button, [tabindex]:not([tabindex='-1'])",
    );
    first?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="executive-mobile-nav">
      <button
        ref={toggleRef}
        type="button"
        className="executive-mobile-nav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="executive-sr-only">
          {open ? closeLabel : openLabel}
        </span>
        {open ? (
          <ExecutiveIconClose className="h-5 w-5" />
        ) : (
          <ExecutiveIconMenu className="h-5 w-5" />
        )}
      </button>

      {open ? (
        <nav
          ref={panelRef}
          id={panelId}
          className="executive-mobile-nav__panel"
          aria-label={menuLabel}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="executive-mobile-nav__link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {localeSwitcher ? (
            <div className="executive-mobile-nav__locale">{localeSwitcher}</div>
          ) : null}
          {whatsapp ? (
            <a
              href={whatsapp.href}
              className="executive-whatsapp-cta executive-whatsapp-cta--block"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsapp.ariaLabel}
              onClick={() => setOpen(false)}
            >
              <ExecutiveIconWhatsApp className="executive-whatsapp-cta__icon" />
              <span>{whatsapp.label}</span>
            </a>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
