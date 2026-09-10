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
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={placeholderClassName} aria-hidden />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      unoptimized
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
