"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavLink = {
  href: string;
  label: string;
};

type Props = {
  links: NavLink[];
  label: string;
};

function hashFromHref(href: string): string {
  const index = href.indexOf("#");
  return index >= 0 ? href.slice(index) : "";
}

export function BeigeHeaderNav({ links, label }: Props) {
  const [hash, setHash] = useState("");

  useEffect(() => {
    function sync() {
      setHash(window.location.hash);
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <nav className="beige-header__nav" aria-label={label}>
      {links.map((link) => {
        const target = hashFromHref(link.href);
        const active = Boolean(target) && hash === target;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={active ? "beige-nav-link is-active" : "beige-nav-link"}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
