"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { MotionPreset } from "@/lib/public-site-content";
import { elegantLocationHash } from "@/themes/elegant/elegant-section-hash";

type Props = {
  preset: MotionPreset;
  children: ReactNode;
};

const SELECTOR = "[data-elegant-reveal]";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ElegantMotionRoot({ preset, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const next = elegantLocationHash(window.location.hash);
    if (next && next !== window.location.hash) {
      const url = `${window.location.pathname}${window.location.search}${next}`;
      window.history.replaceState(null, "", url);
      document.getElementById(next.slice(1))?.scrollIntoView();
    }

    const root =
      ref.current?.closest("[data-site-theme='elegant']") ?? ref.current;
    if (!root || preset === "none" || prefersReducedMotion()) {
      root?.setAttribute("data-elegant-motion", "none");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    for (const node of root.querySelectorAll(SELECTOR)) observer.observe(node);
    root.classList.add("elegant-motion-ready");

    return () => {
      observer.disconnect();
      root.classList.remove("elegant-motion-ready");
    };
  }, [preset]);

  return (
    <div ref={ref} className="elegant-motion-root">
      {children}
    </div>
  );
}
