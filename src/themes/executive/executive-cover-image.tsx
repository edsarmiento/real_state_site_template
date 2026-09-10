"use client";

import { useState } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  className: string;
  placeholderClassName: string;
  placeholder: string;
};

export function ExecutiveCoverImage({
  src,
  alt,
  className,
  placeholderClassName,
  placeholder,
}: Props) {
  const imageSrc = src?.trim() || null;
  const [failed, setFailed] = useState(false);

  if (!imageSrc || failed) {
    return <div className={placeholderClassName}>{placeholder}</div>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
