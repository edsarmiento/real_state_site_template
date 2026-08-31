import { NextResponse } from "next/server";
import { apiBaseUrl } from "@/lib/api-url";
import { accountId } from "@/lib/site-config-env";
import { getBearerAuthHeaders } from "@/lib/api-auth";

export async function proxyResponse(upstream: Response): Promise<NextResponse> {
  const contentType =
    upstream.headers.get("content-type") ?? "application/json";
  const isJson =
    contentType.includes("application/json") ||
    contentType.startsWith("text/");

  if (!isJson) {
    const buffer = await upstream.arrayBuffer();
    const headers: Record<string, string> = { "Content-Type": contentType };
    const disposition = upstream.headers.get("content-disposition");
    if (disposition) headers["Content-Disposition"] = disposition;

    return new NextResponse(buffer.byteLength ? buffer : null, {
      status: upstream.status,
      headers,
    });
  }

  const text = await upstream.text();
  return new NextResponse(text.length ? text : null, {
    status: upstream.status,
    headers: { "Content-Type": contentType },
  });
}

export async function proxyToApi(
  path: string,
  init: RequestInit = {},
): Promise<NextResponse> {
  const auth = await getBearerAuthHeaders();
  if (!auth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const upstream = await fetch(`${apiBaseUrl()}${path}`, {
    cache: "no-store",
    ...init,
    headers: { ...auth, ...(init.headers ?? {}) },
  });

  return proxyResponse(upstream);
}

function withAccountId(path: string): string {
  const url = new URL(path, "http://local");
  url.searchParams.set("account_id", String(accountId()));
  return `${url.pathname}${url.search}`;
}

export async function proxyPublicToApi(
  path: string,
  init: RequestInit = {},
): Promise<NextResponse> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (init.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const upstream = await fetch(`${apiBaseUrl()}${withAccountId(path)}`, {
    cache: "no-store",
    ...init,
    headers,
  });

  return proxyResponse(upstream);
}

export async function proxyMultipartToApi(
  path: string,
  request: Request,
): Promise<NextResponse> {
  const auth = await getBearerAuthHeaders({ omitContentType: true });
  if (!auth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type");
  const body = await request.arrayBuffer();

  const upstream = await fetch(`${apiBaseUrl()}${path}`, {
    cache: "no-store",
    method: request.method,
    headers: {
      ...auth,
      ...(contentType ? { "Content-Type": contentType } : {}),
    },
    body,
  });

  return proxyResponse(upstream);
}

export async function readJsonBody(
  request: Request,
): Promise<{ ok: true; data: unknown } | { ok: false; response: NextResponse }> {
  try {
    return { ok: true, data: await request.json() };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "JSON inválido" }, { status: 400 }),
    };
  }
}

export function assertIntegerId(id: string): NextResponse | null {
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  return null;
}
