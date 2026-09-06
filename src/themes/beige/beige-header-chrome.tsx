"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  brand: ReactNode;
  nav: ReactNode;
  tools: ReactNode;
};

export function BeigeHeaderChrome({ brand, nav, tools }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      setScrolled(window.scrollY > 16);
    }
    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`beige-header${scrolled ? " is-scrolled" : ""}`}
    >
      <div className="beige-header__bar">
        <div className="beige-header__inner">
          <div className="beige-header__brand">{brand}</div>
          {nav}
          <div className="beige-header__tools">{tools}</div>
        </div>
      </div>
    </header>
  );
}
