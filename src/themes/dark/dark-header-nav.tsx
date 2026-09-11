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

export function DarkHeaderNav({ links, label }: Props) {
  const [hash, setHash] = useState("");

  useEffect(() => {
    function sync() {
      setHash(window.location.hash);
    }
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  return (
    <nav className="dark-header__nav" aria-label={label}>
      {links.map((link) => {
        const target = hashFromHref(link.href);
        const active = Boolean(target) && hash === target;
        return (
          <Link
            key={link.href}
            href={link.href}
            onNavigate={() => setHash(target)}
            className={active ? "dark-nav-link is-active" : "dark-nav-link"}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
