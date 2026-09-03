"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function BeigeReveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = node.closest("[data-site-theme='beige']");
    if (!root || root.getAttribute("data-beige-motion") !== "subtle") return;

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

    if (root.classList.contains("beige-js")) {
      arm();
    } else {
      const mutations = new MutationObserver(() => {
        if (root.classList.contains("beige-js")) {
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
    <div
      ref={ref}
      className={["beige-reveal", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
