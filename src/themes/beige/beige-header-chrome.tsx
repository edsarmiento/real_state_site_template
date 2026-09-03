"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  light: boolean;
  topBar: ReactNode;
  brand: ReactNode;
  nav: ReactNode;
  tools: ReactNode;
};

export function BeigeHeaderChrome({
  light,
  topBar,
  brand,
  nav,
  tools,
}: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = light
    ? "beige-glass-nav beige-glass-nav--light"
    : "beige-glass-nav";
  const textClass = light ? "text-[#2D2A26]" : "text-white";

  return (
    <header
      className={`beige-header sticky top-0 z-50 ${scrolled ? "is-scrolled" : ""}`}
    >
      {topBar}
      <div className={`relative ${navClass} ${textClass}`}>
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-4 px-6 lg:h-28">
          {brand}
          {nav}
          {tools}
        </div>
      </div>
    </header>
  );
}
