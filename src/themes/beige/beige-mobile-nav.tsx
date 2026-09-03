"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  BeigeIconClose,
  BeigeIconMenu,
  BeigeIconWhatsApp,
} from "@/themes/beige/beige-icons";

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
  light?: boolean;
};

export function BeigeMobileNav({
  links,
  whatsapp,
  menuLabel,
  openLabel,
  closeLabel,
  localeSwitcher,
  light = false,
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
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const iconColor = light ? "text-[#2D2A26]" : "text-[#FBF9F5]";

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        className={`inline-flex h-10 w-10 items-center justify-center ${iconColor}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="beige-sr-only">{open ? closeLabel : openLabel}</span>
        {open ? (
          <BeigeIconClose className="h-6 w-6" />
        ) : (
          <BeigeIconMenu className="h-6 w-6" />
        )}
      </button>

      {open ? (
        <nav
          id={panelId}
          className="absolute left-0 right-0 top-full z-50 border-t border-[#E5D9C5] bg-[#FBF9F5] px-6 py-6 shadow-xl"
          aria-label={menuLabel}
        >
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium tracking-wide text-[#2D2A26]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {localeSwitcher ? <div>{localeSwitcher}</div> : null}
            {whatsapp ? (
              <a
                href={whatsapp.href}
                className="inline-flex items-center gap-2 rounded-full bg-[#A4B494] px-4 py-2 text-sm font-medium text-[#2D2A26]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={whatsapp.ariaLabel}
                onClick={() => setOpen(false)}
              >
                <BeigeIconWhatsApp className="h-4 w-4" />
                {whatsapp.label}
              </a>
            ) : null}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
