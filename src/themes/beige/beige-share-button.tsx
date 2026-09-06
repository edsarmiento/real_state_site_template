"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BEIGE_FONT_CLASS } from "@/themes/beige/beige-fonts";
import {
  buildShareData,
  isShareAbortError,
  normalizeShareUrl,
} from "@/themes/beige/beige-share";

type Props = {
  title: string;
  url: string;
  text?: string;
  shareLabel: string;
  heading: string;
  copyLabel: string;
  copiedLabel: string;
  failedLabel: string;
  closeLabel: string;
};

type CopyStatus = "idle" | "copied" | "failed";

const FOCUSABLE =
  'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

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
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.focus();
    input.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(input);
    return ok;
  } catch {
    return false;
  }
}

export function BeigeShareButton({
  title,
  url,
  text,
  shareLabel,
  heading,
  copyLabel,
  copiedLabel,
  failedLabel,
  closeLabel,
}: Props) {
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(false);
  const restoreFocusRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState(url);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    restoreFocusRef.current = true;
    urlRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const nodes = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (node) => !node.hasAttribute("disabled"),
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    triggerRef.current?.focus();
  }, [isOpen]);

  function flash(next: Exclude<CopyStatus, "idle">) {
    setCopyStatus(next);
    window.setTimeout(() => setCopyStatus("idle"), 2200);
  }

  async function onTrigger() {
    if (busyRef.current) return;
    busyRef.current = true;
    const nextUrl = normalizeShareUrl(url, window.location.href);
    const payload = buildShareData({ title, text, url: nextUrl });
    setShareUrl(nextUrl);

    try {
      if (typeof navigator.share === "function") {
        try {
          await navigator.share(payload);
          return;
        } catch (err) {
          if (isShareAbortError(err)) return;
        }
      }
      setIsOpen(true);
    } finally {
      busyRef.current = false;
    }
  }

  async function onCopy() {
    const ok = await copyText(shareUrl);
    flash(ok ? "copied" : "failed");
  }

  const modal =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            className={`beige-share-layer ${BEIGE_FONT_CLASS}`}
            data-site-theme="beige"
          >
            <div
              data-beige-share-backdrop=""
              className="beige-share-backdrop"
              onClick={() => setIsOpen(false)}
            />
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              data-beige-share-modal=""
              data-open="true"
              className="beige-share-modal"
            >
              <h2 id={titleId} className="beige-share-modal__title">
                {heading}
              </h2>
              <input
                ref={urlRef}
                id={`${titleId}-url`}
                className="beige-share-modal__url"
                value={shareUrl}
                readOnly
                aria-label={shareUrl}
                onFocus={(event) => event.currentTarget.select()}
              />
              <p className="beige-share-modal__live" aria-live="polite">
                {copyStatus === "copied"
                  ? copiedLabel
                  : copyStatus === "failed"
                    ? failedLabel
                    : ""}
              </p>
              {/* Native share already ran or is unavailable; retry would be noise. */}
              <div className="beige-share-modal__actions">
                <button
                  type="button"
                  className="beige-share-modal__secondary"
                  onClick={() => void onCopy()}
                >
                  {copyStatus === "copied" ? copiedLabel : copyLabel}
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  className="beige-share-modal__close"
                  onClick={() => setIsOpen(false)}
                >
                  {closeLabel}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="beige-share-button"
        onClick={() => void onTrigger()}
      >
        <ShareIcon className="h-4 w-4 shrink-0" />
        {shareLabel}
      </button>
      {modal}
    </>
  );
}
