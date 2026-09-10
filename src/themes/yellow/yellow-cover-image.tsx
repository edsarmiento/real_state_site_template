"use client";

import { useState, type ReactNode } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  className: string;
  placeholderClassName: string;
  placeholder: ReactNode;
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
    const announce =
      typeof placeholder === "string" && placeholder.trim() !== "";
    return (
      <div className={placeholderClassName} aria-hidden={!announce}>
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
