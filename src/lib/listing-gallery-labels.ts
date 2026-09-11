import { getDictionary, type SiteLocale } from "@/lib/site-i18n";

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

/** Spanish fallback when a localized gallery string is missing. */
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

function pickLabel(
  value: string | undefined,
  fallback: string,
): string {
  const trimmed = value?.trim() ?? "";
  return trimmed || fallback;
}

/** Resolve carousel/a11y gallery labels for a locale; Spanish defaults fill gaps. */
export function listingGalleryLabelsForLocale(
  locale: SiteLocale,
): ListingGalleryLabels {
  const gallery = getDictionary(locale).listing.gallery;
  return {
    empty: pickLabel(gallery.empty, DEFAULT_LISTING_GALLERY_LABELS.empty),
    carouselRole: pickLabel(
      gallery.carouselRole,
      DEFAULT_LISTING_GALLERY_LABELS.carouselRole,
    ),
    photosOf: pickLabel(
      gallery.photosOf,
      DEFAULT_LISTING_GALLERY_LABELS.photosOf,
    ),
    photoAlt: pickLabel(
      gallery.photoAlt,
      DEFAULT_LISTING_GALLERY_LABELS.photoAlt,
    ),
    prev: pickLabel(gallery.prev, DEFAULT_LISTING_GALLERY_LABELS.prev),
    next: pickLabel(gallery.next, DEFAULT_LISTING_GALLERY_LABELS.next),
    indicators: pickLabel(
      gallery.indicators,
      DEFAULT_LISTING_GALLERY_LABELS.indicators,
    ),
    goTo: pickLabel(gallery.goTo, DEFAULT_LISTING_GALLERY_LABELS.goTo),
    view: pickLabel(gallery.view, DEFAULT_LISTING_GALLERY_LABELS.view),
  };
}
