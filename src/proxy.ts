import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  fetchCurrentUserWithToken,
  findMembership,
  membershipGrantsAdminAccess,
} from "@/lib/account-context";
import { ADMIN_HOME_PATH, isPublicCatalogPath } from "@/lib/access-control";
import { clearAuthCookiesOn } from "@/lib/clear-auth-cookies";

function nextWithPathname(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  const isLoginPage = pathname === "/login";

  const isAuthPublicPage = isLoginPage;

  const isAuthApiPublic =
    pathname === "/api/auth/login" ||
    pathname.startsWith("/api/auth/login/") ||
    pathname === "/api/auth/logout" ||
    pathname.startsWith("/api/auth/logout/");

  const isPublicApi =
    pathname === "/api/public" || pathname.startsWith("/api/public/");

  if (isPublicCatalogPath(pathname) || isPublicApi) {
    return nextWithPathname(request, pathname);
  }

  if (isAuthPublicPage) {
    if (isLoginPage && request.nextUrl.searchParams.get("auth") === "expired") {
      return clearAuthCookiesOn(nextWithPathname(request, pathname));
    }

    if (token) {
      const user = await fetchCurrentUserWithToken(token);
      const membership = user ? findMembership(user.memberships) : undefined;
      if (
        user &&
        membershipGrantsAdminAccess(membership) &&
        !user.platform_ops
      ) {
        return NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url));
      }
    }

    return nextWithPathname(request, pathname);
  }

  if (isAuthApiPublic) {
    return nextWithPathname(request, pathname);
  }

  if (!token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(login);
  }

  return nextWithPathname(request, pathname);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
