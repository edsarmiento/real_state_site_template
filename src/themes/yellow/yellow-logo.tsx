"use client";

import { useState } from "react";
import { brandInitial } from "@/themes/yellow/yellow-display";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
};

export function YellowLogo({ src, alt, className, fallbackClassName }: Props) {
  const imageSrc = src.trim();
  return (
    <YellowLogoInner
      key={imageSrc}
      src={imageSrc}
      alt={alt}
      className={className}
      fallbackClassName={fallbackClassName}
    />
  );
}

function YellowLogoInner({ src, alt, className, fallbackClassName }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className={fallbackClassName} aria-hidden>
        {brandInitial(alt) || "·"}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={["yellow-logo", className].filter(Boolean).join(" ")}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
