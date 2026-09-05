"use client";

import { useEffect, useState } from "react";
import { OrangeIconCheckCircle } from "@/themes/orange/orange-icons";

type Props = {
  /** Empty string keeps the toast hidden. */
  message: string;
  /** Bumped by the caller so repeat submissions re-show the toast. */
  token: number;
  durationMs?: number;
};

/**
 * Editorial toast anchored to the bottom-right corner. It stays mounted as a
 * live region so screen readers announce the message, and keeps the text while
 * sliding out so the exit transition is not left with an empty box.
 */
export function OrangeToast({ message, token, durationMs = 4000 }: Props) {
  const [dismissed, setDismissed] = useState(-1);
  const shown = message !== "" && dismissed !== token;

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setDismissed(token), durationMs);
    return () => window.clearTimeout(timer);
  }, [message, token, durationMs]);

  return (
    <div
      className="orange-toast"
      data-shown={shown ? "true" : "false"}
      role="status"
      aria-live="polite"
    >
      <OrangeIconCheckCircle aria-hidden />
      <span>{message}</span>
    </div>
  );
}
