"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { dialogKeyboardAction } from "@/themes/elegant/elegant-dialog-keys";
import {
  ElegantIconClose,
  ElegantIconMenu,
  ElegantIconWhatsApp,
} from "@/themes/elegant/elegant-icons";

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

const FOCUSABLE =
  "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function ElegantMobileNav({
  links,
  whatsapp,
  menuLabel,
  openLabel,
  closeLabel,
  localeSwitcher,
}: Props) {
  const [open, setOpen] = useState(false);
  const [headerEl, setHeaderEl] = useState<Element | null>(null);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setHeaderEl(toggleRef.current?.closest(".elegant-header") ?? null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    function focusables(): HTMLElement[] {
      const root = panelRef.current;
      if (!root) return [];
      return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => !node.hasAttribute("aria-hidden"),
      );
    }

    function onKey(event: KeyboardEvent) {
      const nodes = focusables();
      const action = dialogKeyboardAction({
        key: event.key,
        shiftKey: event.shiftKey,
        activeIndex: nodes.findIndex((node) => node === document.activeElement),
        count: nodes.length,
      });
      if (!action) return;
      event.preventDefault();
      if (action.type === "close") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      nodes[action.index]?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const panel = open ? (
    <nav
      ref={panelRef}
      id={panelId}
      className="elegant-mobile-nav__panel"
      aria-label={menuLabel}
      role="dialog"
      aria-modal="true"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="elegant-mobile-nav__link"
          onClick={() => setOpen(false)}
        >
          {link.label}
        </Link>
      ))}
      {localeSwitcher ? (
        <div className="elegant-mobile-nav__locale">{localeSwitcher}</div>
      ) : null}
      {whatsapp ? (
        <a
          href={whatsapp.href}
          className="elegant-btn elegant-btn--gold"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={whatsapp.ariaLabel}
          onClick={() => setOpen(false)}
        >
          <ElegantIconWhatsApp className="h-4 w-4" />
          <span>{whatsapp.label}</span>
        </a>
      ) : null}
    </nav>
  ) : null;

  return (
    <div className="elegant-mobile-nav">
      <button
        ref={toggleRef}
        type="button"
        className="elegant-mobile-nav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="elegant-sr-only">{open ? closeLabel : openLabel}</span>
        {open ? (
          <ElegantIconClose className="h-6 w-6" />
        ) : (
          <ElegantIconMenu className="h-6 w-6" />
        )}
      </button>
      {panel && headerEl ? createPortal(panel, headerEl) : panel}
    </div>
  );
}
