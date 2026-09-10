"use client";

import { useState, type ReactNode } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  className: string;
  placeholderClassName: string;
  placeholder: ReactNode;
  /** When true, the fallback is decorative and hidden from assistive tech. */
  decorative?: boolean;
};

export function YellowCoverImage({
  src,
  alt,
  className,
  placeholderClassName,
  placeholder,
  decorative = false,
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
      decorative={decorative}
    />
  );
}

function YellowCoverImageInner({
  src,
  alt,
  className,
  placeholderClassName,
  placeholder,
  decorative,
}: Omit<Props, "src"> & { src: string | null; decorative: boolean }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={placeholderClassName} aria-hidden={decorative}>
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
