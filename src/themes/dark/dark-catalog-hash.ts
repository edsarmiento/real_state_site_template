/** Catalog section id for Dark (`#propiedades`). */
export const DARK_CATALOG_SECTION_ID = "propiedades";

export function darkCatalogHashTarget(
  hash: string,
): typeof DARK_CATALOG_SECTION_ID | null {
  const key = hash.replace(/^#/, "").trim().toLowerCase();
  if (key === DARK_CATALOG_SECTION_ID || key === "inventario") {
    return DARK_CATALOG_SECTION_ID;
  }
  return null;
}

export function darkCatalogScrollBehavior(
  prefersReducedMotion: boolean,
): ScrollBehavior {
  return prefersReducedMotion ? "auto" : "smooth";
}

/**
 * Scroll to the catalog section and move keyboard focus to its heading
 * without a second scroll jump (`preventScroll`).
 */
export function focusDarkCatalogSection(
  root: ParentNode | Document,
  options: {
    prefersReducedMotion: boolean;
    scrollIntoView?: (el: Element, behavior: ScrollBehavior) => void;
  },
): boolean {
  const section = root.querySelector<HTMLElement>(
    `#${DARK_CATALOG_SECTION_ID}`,
  );
  if (!section) return false;

  const behavior = darkCatalogScrollBehavior(options.prefersReducedMotion);
  const scroll =
    options.scrollIntoView ??
    ((el, b) => {
      el.scrollIntoView({ behavior: b, block: "start" });
    });
  scroll(section, behavior);

  const heading =
    section.querySelector<HTMLElement>("[data-dark-catalog-heading]") ??
    section.querySelector<HTMLElement>("h2") ??
    section;

  const active =
    typeof document !== "undefined" ? document.activeElement : null;
  if (heading !== active) {
    if (!heading.hasAttribute("tabindex")) {
      heading.tabIndex = -1;
    }
    heading.focus({ preventScroll: true });
  }
  return true;
}
