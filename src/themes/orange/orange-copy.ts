import type { SiteLocale } from "@/lib/site-i18n";

export type OrangeCopy = {
  contactUnifiedDescription: string;
  consultCtaShort: string;
  heroTitleAccent: string;
  availableOne: string;
  availableMany: string;
  share: string;
  shareCopied: string;
  paginationAria: string;
  paginationPrev: string;
  paginationNext: string;
  paginationPreviousAria: string;
  paginationNextAria: string;
  paginationPageAria: string;
  paginationPageOf: string;
};

const ES: OrangeCopy = {
  contactUnifiedDescription: "Consultas de renta y venta. Elige el canal que prefieras.",
  consultCtaShort: "Asesoría",
  heroTitleAccent: "bienes raíces",
  availableOne: "1 propiedad disponible",
  availableMany: "{count} propiedades disponibles",
  share: "Compartir",
  shareCopied: "Enlace copiado",
  paginationAria: "Paginación de propiedades",
  paginationPrev: "Anterior",
  paginationNext: "Siguiente",
  paginationPreviousAria: "Ir a la página anterior de propiedades",
  paginationNextAria: "Ir a la página siguiente de propiedades",
  paginationPageAria: "Ir a la página {page} de propiedades",
  paginationPageOf: "Página {page} de {total}",
};

const EN: OrangeCopy = {
  contactUnifiedDescription: "Rental and sale inquiries. Choose the channel you prefer.",
  consultCtaShort: "Consult",
  heroTitleAccent: "real estate",
  availableOne: "1 property available",
  availableMany: "{count} properties available",
  share: "Share",
  shareCopied: "Link copied",
  paginationAria: "Property pagination",
  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPreviousAria: "Go to the previous property page",
  paginationNextAria: "Go to the next property page",
  paginationPageAria: "Go to property page {page}",
  paginationPageOf: "Page {page} of {total}",
};

export function getOrangeCopy(locale: SiteLocale): OrangeCopy {
  return locale === "en" ? EN : ES;
}
