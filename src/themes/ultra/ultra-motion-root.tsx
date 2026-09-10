"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { MotionPreset } from "@/lib/public-site-content";

type Props = {
  preset: MotionPreset;
  children: ReactNode;
};

const SELECTOR = "[data-ultra-reveal]";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isInViewport(node: Element): boolean {
  const bounds = node.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}

export function UltraMotionRoot({ preset, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root =
      ref.current?.closest("[data-site-theme='ultra']") ?? ref.current;
    if (!root || preset === "none" || prefersReducedMotion()) return;

    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -64px 0px" },
    );

    function observe(node: Element) {
      if (seen.has(node)) return;
      seen.add(node);
      observer.observe(node);
    }

    function collect(scope: ParentNode) {
      for (const node of scope.querySelectorAll(SELECTOR)) observe(node);
    }

    collect(root);
    for (const el of [...root.querySelectorAll(SELECTOR)].filter(isInViewport)) {
      el.classList.add("is-visible");
    }
    root.classList.add("ultra-motion-ready");

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SELECTOR)) observe(node);
          collect(node);
        }
      }
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, [preset]);

  return (
    <div ref={ref} className="ultra-motion-root">
      {children}
    </div>
  );
}
