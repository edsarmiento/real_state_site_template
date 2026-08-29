import { NextResponse } from "next/server";
import { apiBaseUrl } from "@/lib/api-url";
import { fetchCurrentUserWithToken } from "@/lib/account-context";
import { authenticatedSessionResponse } from "@/lib/session-cookies";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "JSON inválido." },
      { status: 400 },
    );
  }

  const email = body.email?.trim();
  const password = body.password;
  if (!email || !password) {
    return NextResponse.json(
      {
        error: "missing_credentials",
        message: "Email y contraseña son obligatorios.",
      },
      { status: 400 },
    );
  }

  // POST /api/v1/users/sign_in → JWT cookie + default workspace
  const upstream = await fetch(`${apiBaseUrl()}/api/v1/users/sign_in`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: { email, password } }),
  });

  const authHeader =
    upstream.headers.get("authorization") ??
    upstream.headers.get("Authorization");

  if (!upstream.ok || !authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error: "invalid_credentials",
        message: "Email o contraseña incorrectos.",
      },
      { status: 401 },
    );
  }

  const jwt = authHeader.slice("Bearer ".length).trim();
  const user = await fetchCurrentUserWithToken(jwt);
  if (!user) {
    return NextResponse.json(
      {
        error: "session_unavailable",
        message: "No se pudo cargar la sesión. Intenta de nuevo.",
      },
      { status: 401 },
    );
  }

  if (!user.platform_ops && user.memberships.length === 0) {
    return NextResponse.json(
      {
        error: "no_membership",
        message: "Tu usuario no tiene acceso a ningún workspace.",
      },
      { status: 403 },
    );
  }

  return authenticatedSessionResponse(jwt, user);
}
