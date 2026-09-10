"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function UltraHeaderChrome({ children }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "ultra-header is-scrolled" : "ultra-header"}>
      {children}
    </header>
  );
}
