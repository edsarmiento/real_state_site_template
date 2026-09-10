export type ListingGalleryLabels = {
  empty: string;
  carouselRole: string;
  photosOf: string;
  photoAlt: string;
  prev: string;
  next: string;
  indicators: string;
  goTo: string;
  view: string;
};

export const DEFAULT_LISTING_GALLERY_LABELS: ListingGalleryLabels = {
  empty: "Sin fotos",
  carouselRole: "carrusel",
  photosOf: "Fotos de {title}",
  photoAlt: "{title} — foto {index} de {count}",
  prev: "Foto anterior",
  next: "Foto siguiente",
  indicators: "Indicadores de foto",
  goTo: "Ir a foto {index}",
  view: "Ver foto {index}",
};
