import type { SiteLocale } from "@/lib/site-i18n";

export type ElegantCopy = {
  contactUnifiedDescription: string;
  paginationPrev: string;
  paginationNext: string;
  paginationPageOf: string;
  paginationAria: string;
  goToPage: string;
  locationsExplore: string;
};

const ES: ElegantCopy = {
  contactUnifiedDescription: "Consultas de renta y venta. Elige el canal que prefieras.",
  paginationPrev: "Anterior",
  paginationNext: "Siguiente",
  paginationPageOf: "Página {current} de {total}",
  paginationAria: "Paginación de propiedades",
  goToPage: "Ir a la página {page}",
  locationsExplore: "Explorar propiedades",
};

const EN: ElegantCopy = {
  contactUnifiedDescription: "Rental and sale inquiries. Choose the channel you prefer.",
  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPageOf: "Page {current} of {total}",
  paginationAria: "Property pagination",
  goToPage: "Go to page {page}",
  locationsExplore: "Browse properties",
};

export function getElegantCopy(locale: SiteLocale): ElegantCopy {
  return locale === "en" ? EN : ES;
}
