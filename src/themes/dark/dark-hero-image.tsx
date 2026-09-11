"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className: string;
  placeholderClassName: string;
  preload?: boolean;
};

export function DarkHeroImage({
  src,
  alt,
  sizes,
  className,
  placeholderClassName,
  preload = false,
}: Props) {
  const heroSrc = src.trim();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!heroSrc || failedSrc === heroSrc) {
    return <div className={placeholderClassName} aria-hidden />;
  }

  return (
    <Image
      src={heroSrc}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      unoptimized
      className={className}
      onError={() => setFailedSrc(heroSrc)}
    />
  );
}
