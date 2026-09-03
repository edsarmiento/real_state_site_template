"use client";

import { useState } from "react";
import { notify } from "@/lib/notifications";
import { listingPublicUrl } from "@/lib/site-config-env";
import type { SiteDictionary } from "@/lib/site-i18n";

type Props = {
  slug: string;
  title: string;
  dict: SiteDictionary;
  className?: string;
};

export function BeigeShareButton({ slug, title, dict, className }: Props) {
  const [copied, setCopied] = useState(false);
  const url = listingPublicUrl(slug);

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      await notify(dict.listing.shareCopied, { variant: "success" });
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      } catch {
        /* user cancelled share or clipboard unavailable */
      }
    }
  }

  return (
    <span className="inline-flex w-full flex-col items-stretch">
      <button type="button" onClick={() => void share()} className={className}>
        {dict.listing.share}
      </button>
      <span className="beige-sr-only" role="status">
        {copied ? dict.listing.shareCopied : ""}
      </span>
    </span>
  );
}
