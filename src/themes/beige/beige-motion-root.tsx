"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { MotionPreset } from "@/lib/public-site-content";

type Props = {
  preset: MotionPreset;
  children: ReactNode;
};

export function BeigeMotionRoot({ preset, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root =
      ref.current?.closest("[data-site-theme='beige']") ?? ref.current;
    if (!root || preset === "none") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("beige-js");
  }, [preset]);

  return (
    <div ref={ref} className="beige-motion-root">
      {children}
    </div>
  );
}
