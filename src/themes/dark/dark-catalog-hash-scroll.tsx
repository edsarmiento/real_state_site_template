"use client";

import { useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  darkCatalogHashTarget,
  focusDarkCatalogSection,
} from "@/themes/dark/dark-catalog-hash";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * After soft navigation to `/…#propiedades`, scroll to the catalog section
 * (Links use scroll={false} so Next does not jump to top or hash).
 */
export function DarkCatalogHashScroll() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useLayoutEffect(() => {
    const target = darkCatalogHashTarget(window.location.hash);
    if (!target) return;

    let cancelled = false;
    let raf = 0;
    let frames = 0;

    const run = () => {
      if (cancelled) return;
      const ok = focusDarkCatalogSection(document, {
        prefersReducedMotion: prefersReducedMotion(),
      });
      if (ok || frames++ >= 45) return;
      raf = window.requestAnimationFrame(run);
    };

    run();

    function onHashChange() {
      frames = 0;
      run();
    }
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname, query]);

  return null;
}
