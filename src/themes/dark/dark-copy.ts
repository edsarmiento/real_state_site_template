import type { SiteLocale } from "@/lib/site-i18n";

export type DarkCopy = {
  paginationPrev: string;
  paginationNext: string;
  paginationPageOf: string;
  paginationAria: string;
  goToPage: string;
  brandMarkFallback: string;
};

const ES: DarkCopy = {
  paginationPrev: "Anterior",
  paginationNext: "Siguiente",
  paginationPageOf: "Página {current} de {total}",
  paginationAria: "Paginación de propiedades",
  goToPage: "Ir a la página {page}",
  brandMarkFallback: "·",
};

const EN: DarkCopy = {
  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPageOf: "Page {current} of {total}",
  paginationAria: "Property pagination",
  goToPage: "Go to page {page}",
  brandMarkFallback: "·",
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
