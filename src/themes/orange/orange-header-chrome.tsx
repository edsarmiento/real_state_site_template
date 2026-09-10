"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function OrangeHeaderChrome({ children }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "orange-header is-scrolled" : "orange-header"}>
      {children}
    </header>
  );
}
