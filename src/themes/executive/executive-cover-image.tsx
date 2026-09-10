"use client";

import { useState } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  className: string;
  placeholderClassName: string;
  placeholder: string;
};

function CoverImageBody({
  imageSrc,
  alt,
  className,
  placeholderClassName,
  placeholder,
}: Props & { imageSrc: string | null }) {
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

export function ExecutiveCoverImage(props: Props) {
  const imageSrc = props.src?.trim() || null;
  return (
    <CoverImageBody
      key={imageSrc ?? "empty"}
      {...props}
      imageSrc={imageSrc}
    />
  );
}
