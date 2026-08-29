"use client";

import { useEffect, useState } from "react";
import {
  googleMapsSearchUrl,
  mapsExternalUrl,
} from "@/lib/maps-links";

type Props = {
  latitude: number;
  longitude: number;
  label?: string;
  showCoordinates?: boolean;
  linkText?: string;
};

export function OpenInMapsLink({
  latitude,
  longitude,
  label,
  showCoordinates = true,
  linkText = "Abrir en el mapa",
}: Props) {
  const [href, setHref] = useState(() =>
    googleMapsSearchUrl(latitude, longitude),
  );

  useEffect(() => {
    setHref(
      mapsExternalUrl(latitude, longitude, {
        label,
        userAgent: navigator.userAgent,
      }),
    );
  }, [latitude, longitude, label]);

  const openInNewTab = href.startsWith("http");

  return (
    <span className="inline-flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
      {showCoordinates ? (
        <span className="tabular-nums text-zinc-600">
          {latitude}, {longitude}
        </span>
      ) : null}
      <a
        href={href}
        {...(openInNewTab
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="text-base font-semibold text-blue-700 underline-offset-2 hover:underline sm:text-sm"
      >
        {linkText}
      </a>
    </span>
  );
}
