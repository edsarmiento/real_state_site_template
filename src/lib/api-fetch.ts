import { redirect } from "next/navigation";
import { apiBaseUrl } from "@/lib/api-url";
import { getBearerAuthHeaders } from "@/lib/api-auth";

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; raw: unknown };

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResult<T>> {
  const auth = await getBearerAuthHeaders();
  if (!auth) redirect("/login");

  const res = await fetch(`${apiBaseUrl()}${path}`, {
    cache: "no-store",
    ...init,
    headers: { ...auth, ...(init.headers ?? {}) },
  });

  if (res.status === 401) redirect("/login?auth=expired");

  if (res.status === 204) {
    return { ok: true, status: 204, data: null as T };
  }

  let raw: unknown = null;
  try {
    raw = await res.json();
  } catch {
    raw = null;
  }

  if (res.ok) {
    return { ok: true, status: res.status, data: raw as T };
  }

  return { ok: false, status: res.status, raw };
}
