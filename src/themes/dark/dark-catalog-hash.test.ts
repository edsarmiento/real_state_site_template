import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DARK_CATALOG_SECTION_ID,
  darkCatalogHashTarget,
  darkCatalogScrollBehavior,
  focusDarkCatalogSection,
} from "./dark-catalog-hash.ts";

describe("darkCatalogHashTarget", () => {
  it("maps catalog hashes to the propiedades section id", () => {
    assert.equal(darkCatalogHashTarget("#propiedades"), "propiedades");
    assert.equal(darkCatalogHashTarget("#inventario"), "propiedades");
    assert.equal(darkCatalogHashTarget("propiedades"), "propiedades");
  });

  it("ignores unrelated hashes", () => {
    assert.equal(darkCatalogHashTarget("#nosotros"), null);
    assert.equal(darkCatalogHashTarget(""), null);
  });
});

describe("darkCatalogScrollBehavior", () => {
  it("uses auto when the user prefers reduced motion", () => {
    assert.equal(darkCatalogScrollBehavior(true), "auto");
    assert.equal(darkCatalogScrollBehavior(false), "smooth");
  });
});

describe("focusDarkCatalogSection", () => {
  it("scrolls once and focuses the catalog heading without a second scroll", () => {
    const scrolls: Array<{ id: string; behavior: ScrollBehavior }> = [];
    const focuses: Array<{ id: string; preventScroll: boolean }> = [];

    const heading = {
      id: "heading",
      hasAttribute: () => false,
      tabIndex: 0,
      focus(opts?: { preventScroll?: boolean }) {
        focuses.push({
          id: this.id,
          preventScroll: Boolean(opts?.preventScroll),
        });
      },
    };

    const section = {
      id: DARK_CATALOG_SECTION_ID,
      querySelector(selector: string) {
        if (selector === "[data-dark-catalog-heading]" || selector === "h2") {
          return heading;
        }
        return null;
      },
      hasAttribute: () => true,
      focus() {
        focuses.push({ id: this.id, preventScroll: false });
      },
    };

    const root = {
      querySelector(selector: string) {
        if (selector === `#${DARK_CATALOG_SECTION_ID}`) return section;
        return null;
      },
    };

    const ok = focusDarkCatalogSection(root as unknown as ParentNode, {
      prefersReducedMotion: true,
      scrollIntoView: (el, behavior) => {
        scrolls.push({
          id: (el as { id: string }).id,
          behavior,
        });
      },
    });

    assert.equal(ok, true);
    assert.deepEqual(scrolls, [
      { id: DARK_CATALOG_SECTION_ID, behavior: "auto" },
    ]);
    assert.deepEqual(focuses, [{ id: "heading", preventScroll: true }]);
    assert.equal(heading.tabIndex, -1);
  });

  it("returns false when the section is missing", () => {
    const root = { querySelector: () => null };
    assert.equal(
      focusDarkCatalogSection(root as unknown as ParentNode, {
        prefersReducedMotion: false,
      }),
      false,
    );
  });
});
