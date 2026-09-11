import type { SiteLocale } from "@/lib/site-i18n";

export type DarkCopy = {
  paginationPrev: string;
  paginationNext: string;
  paginationPageOf: string;
  paginationAria: string;
  goToPage: string;
  brandMarkFallback: string;
  /** Honest principles when SiteConfig has no testimonials (not fake quotes). */
  principlesEyebrow: string;
  principlesTitle: string;
  principles: readonly { title: string; body: string }[];
};

const ES: DarkCopy = {
  paginationPrev: "Anterior",
  paginationNext: "Siguiente",
  paginationPageOf: "Página {current} de {total}",
  paginationAria: "Paginación de propiedades",
  goToPage: "Ir a la página {page}",
  brandMarkFallback: "·",
  principlesEyebrow: "Cómo acompañamos",
  principlesTitle: "Principios de atención",
  principles: [
    {
      title: "Información clara",
      body: "Publicamos precio, ubicación y características visibles desde el anuncio.",
    },
    {
      title: "Contacto directo",
      body: "WhatsApp o formulario en la ficha: tu mensaje llega a la inmobiliaria.",
    },
    {
      title: "Sin fricción",
      body: "Filtra, compara y agenda desde el catálogo sin pasos inventados.",
    },
  ],
};

const EN: DarkCopy = {
  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPageOf: "Page {current} of {total}",
  paginationAria: "Property pagination",
  goToPage: "Go to page {page}",
  brandMarkFallback: "·",
  principlesEyebrow: "How we work with you",
  principlesTitle: "Attention principles",
  principles: [
    {
      title: "Clear information",
      body: "Price, location, and specs stay visible on every listing.",
    },
    {
      title: "Direct contact",
      body: "WhatsApp or the listing form reaches the agency directly.",
    },
    {
      title: "Low friction",
      body: "Filter, compare, and reach out from the catalog without invented steps.",
    },
  ],
};

export function getDarkCopy(locale: SiteLocale): DarkCopy {
  return locale === "en" ? EN : ES;
}

export function darkBrandMonogram(name: string, fallback = "·"): string {
  const letter = name.trim().charAt(0);
  return letter ? letter.toUpperCase() : fallback;
}

export function displayListingTitle(title: string): string {
  return title
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\uFE0F/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
