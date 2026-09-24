import type { SiteLocale } from "@/lib/site-i18n";

export type BeigeCopy = {
  contactDescription: string;
  paginationPrev: string;
  paginationNext: string;
  paginationPageOf: string;
  paginationAria: string;
  goToPage: string;
};

const ES: BeigeCopy = {
  contactDescription: "Consultas de renta y venta. Elige el canal que prefieras.",
  paginationPrev: "Anterior",
  paginationNext: "Siguiente",
  paginationPageOf: "Página {current} de {total}",
  paginationAria: "Paginación de propiedades",
  goToPage: "Ir a la página {page}",
};

const EN: BeigeCopy = {
  contactDescription: "Rental and sale inquiries. Choose the channel you prefer.",
  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPageOf: "Page {current} of {total}",
  paginationAria: "Property pagination",
  goToPage: "Go to page {page}",
};

export function getBeigeCopy(locale: SiteLocale): BeigeCopy {
  return locale === "en" ? EN : ES;
}
