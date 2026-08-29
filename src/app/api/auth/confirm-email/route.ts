import { NextResponse } from "next/server";
import { apiBaseUrl } from "@/lib/api-url";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("confirmation_token")?.trim() ?? "";
  if (!token) {
    return NextResponse.json(
      { message: "Falta el token de confirmación." },
      { status: 422 },
    );
  }

  const upstream = await fetch(
    `${apiBaseUrl()}/api/v1/users/confirmation?confirmation_token=${encodeURIComponent(token)}`,
    { headers: { Accept: "application/json" }, cache: "no-store" },
  );
  const data: unknown = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}

export async function POST(request: Request) {
  let body: { email?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const upstream = await fetch(`${apiBaseUrl()}/api/v1/users/confirmation`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: { email: body.email } }),
  });
  const data: unknown = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}
