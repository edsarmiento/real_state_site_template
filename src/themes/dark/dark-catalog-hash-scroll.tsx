"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  darkCatalogHashTarget,
  focusDarkCatalogSection,
} from "@/themes/dark/dark-catalog-hash";

const useBeforePaintEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

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

  useBeforePaintEffect(() => {

    let cancelled = false;
    let raf = 0;
    let frames = 0;

    const run = () => {
      if (cancelled || !darkCatalogHashTarget(window.location.hash)) return;
      const ok = focusDarkCatalogSection(document, {
        prefersReducedMotion: prefersReducedMotion(),
      });
      if (ok || frames++ >= 45) return;
      raf = window.requestAnimationFrame(run);
    };

    run();

    function onHashChange() {
      window.cancelAnimationFrame(raf);
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
