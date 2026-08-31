"use client";

import { useSyncExternalStore } from "react";
import { googleMapsSearchUrl, mapsExternalUrl } from "@/lib/maps-links";
import { LuxuryButton } from "@/themes/luxury/luxury-button";

type Props = {
  latitude: number;
  longitude: number;
  label?: string;
  linkText: string;
};

function subscribeToUserAgent(): () => void {
  return () => {};
}

export function LuxuryMapsButton({
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
    <LuxuryButton href={href} variant="gold" size="sm" target="_blank">
      {linkText}
    </LuxuryButton>
  );
}
