import type { SiteLocale } from "@/lib/site-i18n";

export type ExecutiveCopy = {
  paginationPrev: string;
  paginationNext: string;
  paginationPageOf: string;
  paginationAria: string;
  goToPage: string;
  locationsExplore: string;
  aboutKicker: string;
  aboutReadyTitle: string;
  aboutAdvisorCta: string;
  benefit1Copy: string;
  benefit2Copy: string;
  benefit3Copy: string;
  catalogTitle: string;
  locationPlaceholder: string;
  investmentPrice: string;
  immediatePrompt: string;
  openWhatsApp: string;
  bedroomsOne: string;
  bedroomsMany: string;
  selectedProperties: string;
};

const ES: ExecutiveCopy = {
  paginationPrev: "Anterior",
  paginationNext: "Siguiente",
  paginationPageOf: "Página {current} de {total}",
  paginationAria: "Paginación de propiedades",
  goToPage: "Ir a la página {page}",
  locationsExplore: "Explorar propiedades",
  aboutKicker: "Confianza y transparencia",
  aboutReadyTitle: "¿Listo para dar el siguiente paso?",
  aboutAdvisorCta: "Hablar con un asesor",
  benefit1Copy: "Información al día sobre disponibilidad y precios publicados.",
  benefit2Copy: "Datos visibles desde el anuncio, sin costos inventados en el sitio.",
  benefit3Copy: "WhatsApp o formulario en la ficha de cada inmueble.",
  catalogTitle: "Inmuebles disponibles",
  locationPlaceholder: "Ciudad / Zona",
  investmentPrice: "Precio",
  immediatePrompt:
    "¿Prefieres atención inmediata? Contáctanos por WhatsApp directamente.",
  openWhatsApp: "Abrir WhatsApp",
  bedroomsOne: "1 recámara",
  bedroomsMany: "{count} recámaras",
  selectedProperties: "Propiedades seleccionadas",
};

const EN: ExecutiveCopy = {
  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPageOf: "Page {current} of {total}",
  paginationAria: "Property pagination",
  goToPage: "Go to page {page}",
  locationsExplore: "Browse properties",
  aboutKicker: "Trust and transparency",
  aboutReadyTitle: "Ready for the next step?",
  aboutAdvisorCta: "Talk to an advisor",
  benefit1Copy: "Up-to-date availability and published prices.",
  benefit2Copy: "Visible listing data, with no invented fees on this site.",
  benefit3Copy: "WhatsApp or the form on each property page.",
  catalogTitle: "Available properties",
  locationPlaceholder: "City / area",
  investmentPrice: "Price",
  immediatePrompt: "Need a quicker reply? Message us on WhatsApp.",
  openWhatsApp: "Open WhatsApp",
  bedroomsOne: "1 bedroom",
  bedroomsMany: "{count} bedrooms",
  selectedProperties: "Selected properties",
};

export function getExecutiveCopy(locale: SiteLocale): ExecutiveCopy {
  return locale === "en" ? EN : ES;
}
