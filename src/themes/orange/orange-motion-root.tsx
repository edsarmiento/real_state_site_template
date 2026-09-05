"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import type { MotionPreset } from "@/lib/public-site-content";

type Props = {
  preset: MotionPreset;
  children: ReactNode;
};

const REVEAL_SELECTOR = "[data-orange-reveal]";
const REVEAL_THRESHOLD = 0.12;
const REVEAL_ROOT_MARGIN_BOTTOM = 80;

// `useLayoutEffect` warns when a client component is rendered on the server.
const useBeforePaintEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Mirrors IntersectionObserver options used for scroll reveals. */
function revealIntersectsViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.height <= 0) return false;

  const viewportBottom = window.innerHeight - REVEAL_ROOT_MARGIN_BOTTOM;
  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, viewportBottom);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  return visibleHeight / rect.height >= REVEAL_THRESHOLD;
}

/**
 * Single IntersectionObserver for every Orange reveal. The initial viewport
 * waits for one painted frame before entering; otherwise the browser receives
 * the hidden and visible states in one render cycle and has nothing to animate.
 */
export function OrangeMotionRoot({ preset, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useBeforePaintEffect(() => {
    const node = ref.current;
    if (!node) return;
    const root =
      node.closest<HTMLElement>("[data-site-theme='orange']") ?? node;

    if (
      preset === "none" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      root.classList.remove("orange-motion-ready");
      return;
    }

    const pendingFrames = new Set<number>();
    const afterFrame = (callback: FrameRequestCallback) => {
      const frame = window.requestAnimationFrame((time) => {
        pendingFrames.delete(frame);
        callback(time);
      });
      pendingFrames.add(frame);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: REVEAL_THRESHOLD,
        rootMargin: `0px 0px -${REVEAL_ROOT_MARGIN_BOTTOM}px 0px`,
      },
    );

    const observeReveal = (el: Element) => {
      if (el.classList.contains("is-visible")) return;
      observer.observe(el);
    };

    const observeWithin = (scope: ParentNode) => {
      for (const el of scope.querySelectorAll(REVEAL_SELECTOR)) {
        observeReveal(el);
      }
    };

    const initialReveals = Array.from(
      node.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );
    const initiallyVisible = initialReveals.filter(revealIntersectsViewport);
    for (const el of initialReveals) {
      if (!initiallyVisible.includes(el)) observer.observe(el);
    }

    // Arm hidden states only after all targets have been located and the
    // observer exists. Two animation frames guarantee that the hidden state is
    // painted once before the hero transitions to its final state.
    root.classList.add("orange-motion-ready");
    afterFrame(() => {
      afterFrame(() => {
        for (const el of initiallyVisible) el.classList.add("is-visible");
      });
    });

    // Catalog pagination swaps card nodes without remounting this provider.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const added of record.addedNodes) {
          if (!(added instanceof Element)) continue;
          if (added.matches(REVEAL_SELECTOR)) observeReveal(added);
          observeWithin(added);
        }
      }
    });
    mutations.observe(node, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      for (const frame of pendingFrames) window.cancelAnimationFrame(frame);
      pendingFrames.clear();
      root.classList.remove("orange-motion-ready");
    };
  }, [preset]);

  return (
    <div ref={ref} className="orange-motion-root">
      {children}
    </div>
  );
}
