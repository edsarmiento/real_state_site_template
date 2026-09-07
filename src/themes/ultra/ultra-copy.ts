import type { SiteLocale } from "@/lib/site-i18n";

export type UltraCopy = {
  paginationPrev: string;
  paginationNext: string;
  paginationPageOf: string;
  paginationAria: string;
  goToPage: string;
  poweredBy: string;
};

const ES: UltraCopy = {
  paginationPrev: "Anterior",
  paginationNext: "Siguiente",
  paginationPageOf: "Página {current} de {total}",
  paginationAria: "Paginación de propiedades",
  goToPage: "Ir a la página {page}",
  poweredBy: "Tecnología para inmobiliarias",
};

const EN: UltraCopy = {
  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPageOf: "Page {current} of {total}",
  paginationAria: "Property pagination",
  goToPage: "Go to page {page}",
  poweredBy: "Real estate technology",
};

export function getUltraCopy(locale: SiteLocale): UltraCopy {
  return locale === "en" ? EN : ES;
}
