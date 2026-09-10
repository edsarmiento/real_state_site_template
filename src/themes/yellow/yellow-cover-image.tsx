"use client";

import { useState } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  className: string;
  placeholderClassName: string;
  placeholder: string;
};

export function YellowCoverImage({
  src,
  alt,
  className,
  placeholderClassName,
  placeholder,
}: Props) {
  const imageSrc = src?.trim() || null;
  return (
    <YellowCoverImageInner
      key={imageSrc ?? ""}
      src={imageSrc}
      alt={alt}
      className={className}
      placeholderClassName={placeholderClassName}
      placeholder={placeholder}
    />
  );
}

function YellowCoverImageInner({
  src,
  alt,
  className,
  placeholderClassName,
  placeholder,
}: Omit<Props, "src"> & { src: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={placeholderClassName} aria-hidden={!placeholder}>
        {placeholder}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
