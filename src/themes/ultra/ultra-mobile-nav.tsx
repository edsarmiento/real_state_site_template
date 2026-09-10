"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  UltraIconClose,
  UltraIconMenu,
  UltraIconWhatsApp,
} from "@/themes/ultra/ultra-icons";

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

export function UltraMobileNav({
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
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      );
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && active === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="ultra-mobile-nav">
      <button
        ref={toggleRef}
        type="button"
        className="ultra-mobile-nav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="ultra-sr-only">{open ? closeLabel : openLabel}</span>
        {open ? (
          <UltraIconClose className="h-6 w-6" />
        ) : (
          <UltraIconMenu className="h-6 w-6" />
        )}
      </button>

      <nav
          ref={panelRef}
          id={panelId}
          className={
            open
              ? "ultra-mobile-nav__panel is-open"
              : "ultra-mobile-nav__panel"
          }
          aria-label={menuLabel}
          aria-hidden={!open}
          inert={!open}
        >
          <button
            type="button"
            className="ultra-mobile-nav__close"
            onClick={() => {
              setOpen(false);
              toggleRef.current?.focus();
            }}
          >
            <span className="ultra-sr-only">{closeLabel}</span>
            <UltraIconClose className="h-7 w-7" />
          </button>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="ultra-mobile-nav__link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {localeSwitcher ? (
            <div className="ultra-mobile-nav__locale">{localeSwitcher}</div>
          ) : null}
          {whatsapp ? (
            <a
              href={whatsapp.href}
              className="ultra-whatsapp-cta ultra-whatsapp-cta--gold"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsapp.ariaLabel}
              onClick={() => setOpen(false)}
            >
              <UltraIconWhatsApp className="ultra-whatsapp-cta__icon" />
              <span>{whatsapp.label}</span>
            </a>
          ) : null}
        </nav>
    </div>
  );
}
