"use client";

import { ListingPhotoGallery } from "@/components/listing-photo-gallery";
import type { ListingPhoto } from "@/lib/listing-types";
import type { SiteDictionary } from "@/lib/site-i18n";

type Props = {
  title: string;
  photos: ListingPhoto[];
  fallbackUrl?: string | null;
  dict: SiteDictionary;
};

/** Orange skin over the shared listing gallery (nav, keys, thumbs). */
export function OrangeGallery({ title, photos, fallbackUrl, dict }: Props) {
  return (
    <ListingPhotoGallery
      title={title}
      photos={photos}
      fallbackUrl={fallbackUrl}
      className="orange-gallery"
      styledLayout={false}
      labels={dict.listing.gallery}
    />
  );
}
