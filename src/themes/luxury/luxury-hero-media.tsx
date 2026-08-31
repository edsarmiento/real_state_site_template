"use client";

import { useState } from "react";
import type { HeroImagePosition } from "@/lib/public-site-content";

type Props = {
  src: string | null;
  position?: HeroImagePosition;
};

const OBJECT_POSITION: Record<HeroImagePosition, string> = {
  center: "center",
  top: "center top",
  bottom: "center bottom",
  left: "left center",
  right: "right center",
};

function usableSrc(src: string | null): string | null {
  if (src == null) return null;
  const value = src.trim();
  return value === "" ? null : value;
}

export function LuxuryHeroMedia({ src, position = "center" }: Props) {
  const imageSrc = usableSrc(src);
  const [status, setStatus] = useState<"pending" | "loaded" | "error">(
    "pending",
  );
  const showPhoto = Boolean(imageSrc) && status !== "error";

  return (
    <div
      className="luxury-hero-media"
      data-state={showPhoto && status === "loaded" ? "photo" : "fallback"}
    >
      <div className="luxury-hero-media__fallback" aria-hidden>
        <span className="luxury-hero-media__wash" />
        <span className="luxury-hero-media__grain" />
        <span className="luxury-hero-media__line luxury-hero-media__line--h" />
        <span className="luxury-hero-media__line luxury-hero-media__line--v" />
        <span className="luxury-hero-media__accent" />
      </div>
      {showPhoto && imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          className={
            status === "loaded"
              ? "luxury-hero-media__image is-loaded"
              : "luxury-hero-media__image"
          }
          style={{ objectPosition: OBJECT_POSITION[position] }}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      ) : null}
      <div className="luxury-hero-media__veil" aria-hidden />
    </div>
  );
}
