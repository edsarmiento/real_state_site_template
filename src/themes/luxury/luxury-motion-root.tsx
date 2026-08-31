"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { MotionPreset } from "@/lib/public-site-content";

type Props = {
  preset: MotionPreset;
  children: ReactNode;
};

export function LuxuryMotionRoot({ preset, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root =
      ref.current?.closest("[data-site-theme='luxury']") ?? ref.current;
    if (!root || preset === "none") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("luxury-js");
  }, [preset]);

  return (
    <div ref={ref} className="luxury-motion-root">
      {children}
    </div>
  );
}
