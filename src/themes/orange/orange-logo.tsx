"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
};

export function OrangeLogo({ src, alt, className, fallbackClassName }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className={fallbackClassName}>{alt}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
  );
}
