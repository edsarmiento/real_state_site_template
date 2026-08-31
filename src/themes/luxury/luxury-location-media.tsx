"use client";

import { useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
  name: string;
};

export function LuxuryLocationMedia({ src, alt, name }: Props) {
  const [failed, setFailed] = useState(false);
  const imageSrc = src?.trim() || null;
  const showFallback = !imageSrc || failed;

  return (
    <div className="luxury-locations__media">
      {showFallback ? (
        <div className="luxury-locations__fallback" aria-hidden>
          <span className="luxury-locations__wash" />
          <span className="luxury-locations__line luxury-locations__line--h" />
          <span className="luxury-locations__line luxury-locations__line--v" />
          <span className="luxury-locations__wordmark">{name}</span>
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={alt}
            className="luxury-locations__image"
            loading="lazy"
            onError={() => setFailed(true)}
          />
          <span className="luxury-locations__overlay" aria-hidden />
        </>
      )}
    </div>
  );
}