"use client";

import { useState } from "react";
import { OrangeIconShare } from "@/themes/orange/orange-icons";

type Props = {
  slug: string;
  title: string;
  label: string;
  copiedLabel: string;
  path?: string;
  className?: string;
};

export function OrangeShareButton({
  slug,
  title,
  label,
  copiedLabel,
  path,
  className,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = new URL(path ?? `/inmueble/${slug}`, window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        /* user cancelled share */
      }
    }
  }

  return (
    <button
      type="button"
      className={className ?? "orange-soft-btn"}
      onClick={() => void share()}
    >
      <OrangeIconShare className="h-3.5 w-3.5" />
      {copied ? copiedLabel : label}
      <span className="sr-only" role="status">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}
