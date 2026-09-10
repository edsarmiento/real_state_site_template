"use client";

import { useSyncExternalStore } from "react";
import { googleMapsSearchUrl, mapsExternalUrl } from "@/lib/maps-links";

type Props = {
  latitude: number;
  longitude: number;
  label?: string;
  linkText: string;
};

function subscribeToUserAgent(): () => void {
  return () => {};
}

export function OrangeMapsButton({
  latitude,
  longitude,
  label,
  linkText,
}: Props) {
  const href = useSyncExternalStore(
    subscribeToUserAgent,
    () =>
      mapsExternalUrl(latitude, longitude, {
        label,
        userAgent: navigator.userAgent,
      }),
    () => googleMapsSearchUrl(latitude, longitude),
  );

  return (
    <a
      href={href}
      className="orange-inline-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {linkText}
    </a>
  );
}
