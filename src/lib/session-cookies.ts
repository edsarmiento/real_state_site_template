import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  ACCOUNT_COOKIE,
  ROLE_COOKIE,
  PLATFORM_OPS_COOKIE,
  accountCookieOptions,
  membershipGrantsAdminAccess,
  findMembership,
  type CurrentUserPayload,
} from "@/lib/account-context";
import { ADMIN_HOME_PATH } from "@/lib/access-control";

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export type PreparedSession = {
  redirectTo: string;
  accountId: number | null;
  role: string | undefined;
  platformOps: boolean;
};

export function prepareAuthenticatedSession(
  user: CurrentUserPayload,
): PreparedSession {
  const membership = findMembership(user.memberships);
  const role = membership?.role;

  return {
    redirectTo: ADMIN_HOME_PATH,
    accountId: membership?.account.id ?? null,
    role,
    platformOps: user.platform_ops === true,
  };
}

export function writeSessionCookies(
  response: NextResponse,
  jwt: string,
  session: PreparedSession,
): void {
  response.cookies.set(AUTH_COOKIE, jwt, authCookieOptions);

  if (session.platformOps) {
    response.cookies.set(PLATFORM_OPS_COOKIE, "1", accountCookieOptions);
  } else {
    response.cookies.delete(PLATFORM_OPS_COOKIE);
  }

  if (session.accountId) {
    response.cookies.set(
      ACCOUNT_COOKIE,
      String(session.accountId),
      accountCookieOptions,
    );
    if (session.role) {
      response.cookies.set(ROLE_COOKIE, session.role, accountCookieOptions);
    } else {
      response.cookies.delete(ROLE_COOKIE);
    }
  } else {
    response.cookies.delete(ACCOUNT_COOKIE);
    response.cookies.delete(ROLE_COOKIE);
  }
}

export function authenticatedSessionResponse(
  jwt: string,
  user: CurrentUserPayload,
  extra: Record<string, unknown> = {},
): NextResponse {
  const membership = findMembership(user.memberships);
  if (
    !membershipGrantsAdminAccess(membership) &&
    user.platform_ops !== true
  ) {
    return NextResponse.json(
      {
        error: "no_access",
        message: "Tu usuario no tiene acceso a esta inmobiliaria.",
      },
      { status: 403 },
    );
  }

  if (user.platform_ops) {
    return NextResponse.json(
      {
        error: "no_access",
        message: "Usa el CRM principal para cuentas de operaciones.",
      },
      { status: 403 },
    );
  }

  const session = prepareAuthenticatedSession(user);
  if (!session.accountId) {
    return NextResponse.json(
      {
        error: "no_access",
        message: "Tu usuario no tiene acceso a esta inmobiliaria.",
      },
      { status: 403 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    redirect_to: session.redirectTo,
    ...extra,
  });
  writeSessionCookies(response, jwt, session);
  return response;
}
