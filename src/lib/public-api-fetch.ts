import { accountId } from "@/lib/site-config";
import { apiBaseUrl } from "@/lib/api-url";

export type PublicApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; data: unknown; status: number };

/** Append account_id for white-label scoping (server-side only). */
export function scopedPublicPath(path: string): string {
  const base = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(base, "http://local");
  url.searchParams.set("account_id", String(accountId()));
  return `${url.pathname}${url.search}`;
}

export async function publicApiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<PublicApiResult<T>> {
  const scoped =
    path.startsWith("/api/public/") && !path.includes("account_id=")
      ? scopedPublicPath(path)
      : path;

  const res = await fetch(`${apiBaseUrl()}${scoped}`, {
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
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
