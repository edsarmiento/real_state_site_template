"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallback: string;
};

function LogoBody({ src, alt, className, fallback }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <span className="executive-logo-fallback">{fallback}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={["executive-logo", className].filter(Boolean).join(" ")}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export function ExecutiveLogo(props: Props) {
  const src = props.src.trim();
  return <LogoBody key={src || "empty"} {...props} src={src} />;
}
