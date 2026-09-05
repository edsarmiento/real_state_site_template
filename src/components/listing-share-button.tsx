"use client";

import { useEffect, useId, useState } from "react";

type Props = {
  url: string;
  title: string;
  text?: string;
  label: string;
  copyLabel?: string;
  copiedLabel: string;
  failedLabel?: string;
  closeLabel?: string;
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
    /* fall through */
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

function canUseNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

/**
 * WhatsApp works as a plain link; share often fails silently on phones when
 * navigator.share hangs/aborts. Strategy:
 * 1) Try native share sync with the tap (URL-only payload).
 * 2) On missing/blocked/failed share → bottom sheet with copy + selectable URL
 *    (second tap has a fresh gesture for clipboard).
 */
export function ListingShareButton({
  url,
  title,
  text,
  label,
  copyLabel = "Copiar enlace",
  copiedLabel,
  failedLabel = "No se pudo compartir",
  closeLabel = "Cerrar",
  className,
}: Props) {
  const titleId = useId();
  const [status, setStatus] = useState<ShareStatus>("idle");
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!sheetUrl) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSheetUrl(null);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetUrl]);

  function flash(next: Exclude<ShareStatus, "idle">) {
    setStatus(next);
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  function openSheet(absoluteUrl: string) {
    setSheetUrl(absoluteUrl);
  }

  function onShare() {
    const absoluteUrl = resolveShareUrl(url);

    // Real phones often expose navigator.share but the sheet never appears
    // (or aborts immediately). WhatsApp works because it is a plain link.
    // On touch devices, always show our sheet first so the tap is never silent.
    const touchUi =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches);

    if (touchUi) {
      openSheet(absoluteUrl);
      return;
    }

    const minimal: ShareData = { url: absoluteUrl };
    const full: ShareData = {
      title,
      text: text ?? title,
      url: absoluteUrl,
    };

    if (!canUseNativeShare()) {
      openSheet(absoluteUrl);
      return;
    }

    const payload =
      typeof navigator.canShare === "function"
        ? navigator.canShare(minimal)
          ? minimal
          : navigator.canShare(full)
            ? full
            : null
        : minimal;

    if (!payload) {
      openSheet(absoluteUrl);
      return;
    }

    void navigator.share(payload).catch((err: unknown) => {
      const aborted =
        err instanceof DOMException && err.name === "AbortError";
      if (aborted) return;
      openSheet(absoluteUrl);
    });
  }

  async function onCopyFromSheet() {
    if (!sheetUrl) return;
    const ok = await copyText(sheetUrl);
    if (ok) {
      flash("copied");
      setSheetUrl(null);
      return;
    }
    flash("failed");
  }

  function onNativeFromSheet() {
    if (!sheetUrl || !canUseNativeShare()) return;
    void navigator.share({ title, url: sheetUrl }).catch((err: unknown) => {
      const aborted =
        err instanceof DOMException && err.name === "AbortError";
      if (!aborted) flash("failed");
    });
  }

  const buttonLabel =
    status === "copied"
      ? copiedLabel
      : status === "failed"
        ? failedLabel
        : label;

  return (
    <div className="relative inline-flex flex-col items-start gap-2">
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

      {sheetUrl ? (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/45"
            aria-label={closeLabel}
            onClick={() => setSheetUrl(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-x-0 bottom-0 z-[81] rounded-t-2xl border border-zinc-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl"
          >
            <h2
              id={titleId}
              className="text-base font-semibold text-zinc-900"
            >
              {label}
            </h2>
            <p className="mt-3 break-all rounded-lg bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 ring-1 ring-zinc-200">
              <a href={sheetUrl} className="underline-offset-2 hover:underline">
                {sheetUrl}
              </a>
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {canUseNativeShare() ? (
                <button
                  type="button"
                  className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white"
                  onClick={onNativeFromSheet}
                >
                  {label}
                </button>
              ) : null}
              <button
                type="button"
                className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900"
                onClick={() => void onCopyFromSheet()}
              >
                {copyLabel}
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-xl px-4 text-sm font-medium text-zinc-600"
                onClick={() => setSheetUrl(null)}
              >
                {closeLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
