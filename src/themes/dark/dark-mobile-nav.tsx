"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { dialogKeyboardAction } from "@/lib/dialog-keyboard";
import {
  DarkIconClose,
  DarkIconMenu,
  DarkIconWhatsApp,
} from "@/themes/dark/dark-icons";

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

export function DarkMobileNav({
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
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    function focusables(): HTMLElement[] {
      const toggle = toggleRef.current;
      const panel = panelRef.current;
      const nodes: HTMLElement[] = [];
      if (toggle) nodes.push(toggle);
      if (panel) {
        for (const node of panel.querySelectorAll<HTMLElement>(FOCUSABLE)) {
          if (!node.hasAttribute("aria-hidden")) nodes.push(node);
        }
      }
      return nodes;
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

  return (
    <div className="dark-mobile-nav">
      <button
        ref={toggleRef}
        type="button"
        className="dark-mobile-nav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="dark-sr-only">{open ? closeLabel : openLabel}</span>
        {open ? (
          <DarkIconClose className="h-5 w-5" />
        ) : (
          <DarkIconMenu className="h-5 w-5" />
        )}
      </button>
      {open ? (
        <nav
          ref={panelRef}
          id={panelId}
          className="dark-mobile-nav__panel"
          aria-label={menuLabel}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="dark-mobile-nav__link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {localeSwitcher ? (
            <div className="dark-mobile-nav__locale">{localeSwitcher}</div>
          ) : null}
          {whatsapp ? (
            <a
              href={whatsapp.href}
              className="dark-whatsapp-cta dark-whatsapp-cta--block"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsapp.ariaLabel}
              onClick={() => setOpen(false)}
            >
              <DarkIconWhatsApp className="dark-whatsapp-cta__icon" />
              <span>{whatsapp.label}</span>
            </a>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
