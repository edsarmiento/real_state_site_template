"use client";

import { useRef, useState } from "react";

type Props = {
  url: string;
  title: string;
  text?: string;
  label: string;
  copiedLabel: string;
  failedLabel?: string;
  className?: string;
};

type ShareStatus = "idle" | "copied" | "failed";

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

function resolveShareUrl(raw: string): string {
  if (typeof window === "undefined") return raw;
  const current = window.location.href.split("#")[0] ?? window.location.href;
  try {
    const configured = new URL(raw, window.location.href);
    // Prefer the live page host/path so LAN / tunnels / custom domains share correctly.
    if (configured.pathname === window.location.pathname) {
      return current;
    }
    return configured.href;
  } catch {
    return current;
  }
}

async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* fall through to execCommand */
  }

  try {
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.top = "0";
    input.style.left = "0";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.focus();
    input.select();
    input.setSelectionRange(0, value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(input);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Mobile: Web Share API (native sheet).
 * Fallback: copy URL (clipboard / execCommand) with visible status — never silent.
 */
export function ListingShareButton({
  url,
  title,
  text,
  label,
  copiedLabel,
  failedLabel = "No se pudo compartir",
  className,
}: Props) {
  const [status, setStatus] = useState<ShareStatus>("idle");
  const busyRef = useRef(false);

  function flash(next: Exclude<ShareStatus, "idle">) {
    setStatus(next);
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  function fallbackCopy(absoluteUrl: string) {
    void copyText(absoluteUrl)
      .then((ok) => flash(ok ? "copied" : "failed"))
      .finally(() => {
        busyRef.current = false;
      });
  }

  function onShare() {
    if (busyRef.current) return;
    busyRef.current = true;

    const absoluteUrl = resolveShareUrl(url);
    // URL-only payload is the most compatible on real iOS / Android browsers.
    const payload: ShareData = {
      title,
      text: text ?? title,
      url: absoluteUrl,
    };

    const share =
      typeof navigator !== "undefined" && typeof navigator.share === "function"
        ? navigator.share.bind(navigator)
        : null;

    if (share) {
      const canShare =
        typeof navigator.canShare !== "function" || navigator.canShare(payload);

      if (canShare) {
        // Must call share synchronously from the tap handler (keep user gesture).
        void share(payload)
          .then(() => {
            busyRef.current = false;
          })
          .catch((err: unknown) => {
            const aborted =
              err instanceof DOMException && err.name === "AbortError";
            if (aborted) {
              busyRef.current = false;
              return;
            }
            fallbackCopy(absoluteUrl);
          });
        return;
      }
    }

    fallbackCopy(absoluteUrl);
  }

  const buttonLabel =
    status === "copied"
      ? copiedLabel
      : status === "failed"
        ? failedLabel
        : label;

  return (
    <button
      type="button"
      onClick={onShare}
      className={
        className ??
        "inline-flex touch-manipulation items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
      }
    >
      <ShareIcon className="h-4 w-4 shrink-0" />
      {buttonLabel}
    </button>
  );
}
