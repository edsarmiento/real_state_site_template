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

export function YellowHeroFrameImage({
  src,
  alt,
  sizes,
  className,
  placeholderClassName,
  preload = false,
}: Props) {
  const imageSrc = src.trim();
  return (
    <YellowHeroFrameImageInner
      key={imageSrc}
      src={imageSrc}
      alt={alt}
      sizes={sizes}
      className={className}
      placeholderClassName={placeholderClassName}
      preload={preload}
    />
  );
}

function YellowHeroFrameImageInner({
  src,
  alt,
  sizes,
  className,
  placeholderClassName,
  preload = false,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const label = alt.trim();
    if (!label) {
      return <div className={placeholderClassName} aria-hidden />;
    }
    return (
      <div
        className={placeholderClassName}
        role="img"
        aria-label={label}
      />
    );
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
