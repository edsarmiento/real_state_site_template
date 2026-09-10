"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { MotionPreset } from "@/lib/public-site-content";

type Props = {
  preset: MotionPreset;
  children: ReactNode;
};

const SELECTOR = "[data-yellow-reveal]";
const HERO_PLAYED_KEY = "yellow-hero-played";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isInViewport(node: Element): boolean {
  const bounds = node.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}

function readHeroPlayed(): boolean {
  try {
    return sessionStorage.getItem(HERO_PLAYED_KEY) === "1";
  } catch {
    return false;
  }
}

function markHeroPlayed() {
  try {
    sessionStorage.setItem(HERO_PLAYED_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function YellowMotionRoot({ preset, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root =
      ref.current?.closest("[data-site-theme='yellow']") ?? ref.current;
    if (!root || preset === "none" || prefersReducedMotion()) return;

    const alreadyPlayed = readHeroPlayed();
    if (alreadyPlayed) root.classList.add("yellow-hero-played");
    else markHeroPlayed();

    const seen = new WeakSet<Element>();
    const pendingFrames = new Set<number>();
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
    root.classList.add("yellow-motion-ready");

    const initiallyVisible = [...root.querySelectorAll(SELECTOR)].filter(
      isInViewport,
    );
    const frame = window.requestAnimationFrame(() => {
      pendingFrames.delete(frame);
      for (const el of initiallyVisible) el.classList.add("is-visible");
    });
    pendingFrames.add(frame);

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
      for (const id of pendingFrames) window.cancelAnimationFrame(id);
      pendingFrames.clear();
      root.classList.remove("yellow-motion-ready");
    };
  }, [preset]);

  return (
    <div ref={ref} className="yellow-motion-root">
      {children}
    </div>
  );
}
