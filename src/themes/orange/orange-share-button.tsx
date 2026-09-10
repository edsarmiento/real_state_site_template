"use client";

import { ListingShareButton } from "@/components/listing-share-button";

type Props = {
  /** Absolute or site-relative listing URL (resolved by the caller). */
  url: string;
  title: string;
  label: string;
  copiedLabel: string;
  copyLabel?: string;
  failedLabel?: string;
  closeLabel?: string;
  className?: string;
};

/** Orange skin over shared Web Share / clipboard behavior. */
export function OrangeShareButton({
  url,
  title,
  label,
  copiedLabel,
  copyLabel,
  failedLabel,
  closeLabel,
  className,
}: Props) {
  return (
    <ListingShareButton
      url={url}
      title={title}
      label={label}
      copiedLabel={copiedLabel}
      copyLabel={copyLabel}
      failedLabel={failedLabel}
      closeLabel={closeLabel}
      className={className ?? "orange-soft-btn"}
    />
  );
}
