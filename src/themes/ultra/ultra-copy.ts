import type { SiteLocale } from "@/lib/site-i18n";

export type UltraCopy = {
  contactDescription: string;
  paginationPrev: string;
  paginationNext: string;
  paginationPageOf: string;
  paginationAria: string;
  goToPage: string;
  poweredBy: string;
  priceSale: string;
  priceRent: string;
  heroSelectedForYou: string;
  emptyFilterTitle: string;
  emptyFilterCopy: string;
};

const ES: UltraCopy = {
  contactDescription: "Consultas de renta y venta. Elige el canal que prefieras.",
  paginationPrev: "Anterior",
  paginationNext: "Siguiente",
  paginationPageOf: "Página {current} de {total}",
  paginationAria: "Paginación de propiedades",
  goToPage: "Ir a la página {page}",
  poweredBy: "Tecnología para inmobiliarias",
  priceSale: "Precio de venta",
  priceRent: "Precio de renta",
  heroSelectedForYou: "Propiedades seleccionadas para ti",
  emptyFilterTitle: "No hay coincidencias",
  emptyFilterCopy: "Ningún inmueble coincide con los filtros actuales.",
};

const EN: UltraCopy = {
  contactDescription: "Rental and sale inquiries. Choose the channel you prefer.",
  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPageOf: "Page {current} of {total}",
  paginationAria: "Property pagination",
  goToPage: "Go to page {page}",
  poweredBy: "Real estate technology",
  priceSale: "Sale price",
  priceRent: "Rental price",
  heroSelectedForYou: "Properties selected for you",
  emptyFilterTitle: "No matches",
  emptyFilterCopy: "No listings match the current filters.",
};

export function getUltraCopy(locale: SiteLocale): UltraCopy {
  return locale === "en" ? EN : ES;
}
