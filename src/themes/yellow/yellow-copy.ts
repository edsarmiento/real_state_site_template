import type { SiteLocale } from "@/lib/site-i18n";

export type YellowCopy = {
  paginationPrev: string;
  paginationNext: string;
  paginationPageOf: string;
  paginationAria: string;
  goToPage: string;
  selectedProperties: string;
  expandGallery: string;
  closeGallery: string;
};

const ES: YellowCopy = {
  paginationPrev: "Anterior",
  paginationNext: "Siguiente",
  paginationPageOf: "Página {current} de {total}",
  paginationAria: "Paginación de propiedades",
  goToPage: "Ir a la página {page}",
  selectedProperties: "Propiedades seleccionadas",
  expandGallery: "Ampliar galería",
  closeGallery: "Cerrar galería",
};

const EN: YellowCopy = {
  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPageOf: "Page {current} of {total}",
  paginationAria: "Property pagination",
  goToPage: "Go to page {page}",
  selectedProperties: "Selected properties",
  expandGallery: "Expand gallery",
  closeGallery: "Close gallery",
};

export function getYellowCopy(locale: SiteLocale): YellowCopy {
  return locale === "en" ? EN : ES;
}
