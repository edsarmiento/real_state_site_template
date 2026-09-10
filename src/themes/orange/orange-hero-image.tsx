"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className: string;
  placeholderClassName: string;
};

export function OrangeHeroImage({
  src,
  alt,
  sizes,
  preload = false,
  className,
  placeholderClassName,
}: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={placeholderClassName} aria-hidden />;
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
