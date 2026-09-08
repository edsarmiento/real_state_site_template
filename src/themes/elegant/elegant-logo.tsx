"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
};

export function ElegantLogo({ src, alt, className, fallbackClassName }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (failedSrc === src) {
    return <span className={fallbackClassName}>{alt}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={["elegant-logo", className].filter(Boolean).join(" ")}
      decoding="async"
      onError={() => setFailedSrc(src)}
    />
  );
}
