"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { OrangeIconClose, OrangeIconMenu } from "@/themes/orange/orange-icons";

type NavLink = { href: string; label: string };

type Props = {
  links: NavLink[];
  consultHref: string;
  consultLabel: string;
  menuLabel: string;
  openLabel: string;
  closeLabel: string;
  localeSwitcher?: ReactNode;
};

export function OrangeMobileNav({
  links,
  consultHref,
  consultLabel,
  menuLabel,
  openLabel,
  closeLabel,
  localeSwitcher,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="orange-mobile-nav md:hidden">
      <button
        ref={toggleRef}
        type="button"
        className="orange-icon-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
        {open ? <OrangeIconClose /> : <OrangeIconMenu />}
      </button>
      {open ? (
        <nav id={panelId} className="orange-mobile-panel" aria-label={menuLabel}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="orange-mobile-panel__link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="orange-mobile-panel__tools">
            {localeSwitcher}
            <Link
              href={consultHref}
              className="orange-btn orange-btn--dark"
              onClick={() => setOpen(false)}
            >
              {consultLabel}
            </Link>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
