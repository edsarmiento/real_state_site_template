import { accountId } from "@/lib/site-config-env";
import { apiBaseUrl } from "@/lib/api-url";
import {
  classifyPublicApiFetchError,
  publicApiNetworkFailureResult,
} from "@/lib/public-api-fetch-transport";

export type PublicApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; data: unknown; status: number };

export {
  classifyPublicApiFetchError,
  publicApiNetworkFailureResult,
  type PublicApiTransportKind,
} from "@/lib/public-api-fetch-transport";

/** Append account_id for white-label scoping (server-side only). */
export function scopedPublicPath(path: string): string {
  const base = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(base, "http://local");
  url.searchParams.set("account_id", String(accountId()));
  return `${url.pathname}${url.search}`;
}

/**
 * Server-side public API helper.
 *
 * Failure modes:
 * - HTTP !ok → `{ ok:false, status: res.status, data }` (body parsed or raw text)
 * - JSON parse fail on body → raw text in `data` (not a transport error)
 * - Network/DNS connect failures from `fetch` → `{ ok:false, status: 503, data: null }`
 * - AbortError / TimeoutError → **rethrown** (no invented status; Ultra catches)
 * - Unexpected thrown values → rethrown
 */
export async function publicApiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<PublicApiResult<T>> {
  const scoped =
    path.startsWith("/api/public/") && !path.includes("account_id=")
      ? scopedPublicPath(path)
      : path;

  let res: Response;
  let text: string;
  try {
    res = await fetch(`${apiBaseUrl()}${scoped}`, {
      cache: "no-store",
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
    });
    text = await res.text();
  } catch (error) {
    const kind = classifyPublicApiFetchError(error);
    if (kind === "network") return publicApiNetworkFailureResult();
    throw error;
  }

  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    return { ok: false, data, status: res.status };
  }
  return { ok: true, data: data as T, status: res.status };
}
