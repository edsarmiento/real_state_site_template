"use client";

import { useState } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  className: string;
  placeholderClassName: string;
  placeholder?: string;
};

export function ElegantCoverImage({
  src,
  alt,
  className,
  placeholderClassName,
  placeholder = "",
}: Props) {
  const imageSrc = src?.trim() || null;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!imageSrc || failedSrc === imageSrc) {
    return <div className={placeholderClassName}>{placeholder}</div>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailedSrc(imageSrc)}
    />
  );
}
