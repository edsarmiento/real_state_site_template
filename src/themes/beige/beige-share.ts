export type BeigeShareData = {
  title: string;
  text: string;
  url: string;
};

/** Drops hashes and prefers the live listing URL when the pathname matches. */
export function normalizeShareUrl(
  raw: string,
  currentHref?: string,
): string {
  const live = (currentHref ?? "").split("#")[0]?.trim() || "";
  try {
    const configured = live ? new URL(raw, live) : new URL(raw);
    configured.hash = "";
    if (live) {
      const current = new URL(live);
      if (configured.pathname === current.pathname) {
        current.hash = "";
        return current.href;
      }
    }
    return configured.href;
  } catch {
    return live || raw.split("#")[0] || raw;
  }
}

export function buildShareData(input: {
  title: string;
  url: string;
  text?: string;
}): BeigeShareData {
  const title = input.title.trim();
  return {
    title,
    text: (input.text ?? input.title).trim() || title,
    url: input.url,
  };
}

export function isShareAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}
