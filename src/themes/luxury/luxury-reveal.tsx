"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

function motionRootOf(node: HTMLElement): HTMLElement | null {
  return node.closest("[data-site-theme='luxury']");
}

export function LuxuryReveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = motionRootOf(node);
    if (!root || root.getAttribute("data-luxury-motion") !== "subtle") return;

    const target = node;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            entry.target.classList.remove("is-pending");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );

    function arm() {
      const bounds = target.getBoundingClientRect();
      const inView = bounds.top < window.innerHeight && bounds.bottom > 0;
      if (inView) {
        target.classList.add("is-in");
        return;
      }
      target.classList.add("is-pending");
      observer.observe(target);
    }

    if (root.classList.contains("luxury-js")) {
      arm();
    } else {
      const mutations = new MutationObserver(() => {
        if (root.classList.contains("luxury-js")) {
          mutations.disconnect();
          arm();
        }
      });
      mutations.observe(root, { attributes: true, attributeFilter: ["class"] });
      return () => {
        mutations.disconnect();
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={["luxury-reveal", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
