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
  access: { href: string; label: string };
  menuLabel: string;
  openLabel: string;
  closeLabel: string;
  localeSwitcher?: ReactNode;
};

export function ExecutiveMobileNav({
  links,
  whatsapp,
  access,
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

    const focusableSelector =
      "a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

    function visibleFocusables(panel: HTMLElement) {
      return Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter(
        (node) =>
          !node.hidden &&
          node.getAttribute("aria-hidden") !== "true" &&
          node.closest("[hidden], [aria-hidden='true']") == null,
      );
    }

    const first = panelRef.current
      ? visibleFocusables(panelRef.current)[0]
      : undefined;
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
      const focusables = visibleFocusables(panel);
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
          <Link
            href={access.href}
            className="executive-access-cta executive-access-cta--block"
            onClick={() => setOpen(false)}
          >
            {access.label}
          </Link>
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
