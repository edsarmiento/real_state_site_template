"use client";

import { useState } from "react";

type Props = {
  url: string;
  title: string;
  text?: string;
  label: string;
  copiedLabel: string;
  className?: string;
};

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51 15.42 17.49" />
      <path d="m15.41 6.51-6.82 3.98" />
    </svg>
  );
}

/**
 * Mobile / supporting browsers: native share sheet (Web Share API).
 * Fallback: copy listing URL to clipboard.
 */
export function ListingShareButton({
  url,
  title,
  text,
  label,
  copiedLabel,
  className,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const payload = { title, text: text ?? title, url };

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share(payload);
        return;
      }
    } catch (err) {
      // User cancelled the share sheet — do nothing.
      if (err instanceof DOMException && err.name === "AbortError") return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: prompt so the user can still copy.
      window.prompt(label, url);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onShare()}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
      }
    >
      <ShareIcon className="h-4 w-4 shrink-0" />
      {copied ? copiedLabel : label}
    </button>
  );
}
