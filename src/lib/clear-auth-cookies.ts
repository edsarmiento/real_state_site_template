import type { NextResponse } from "next/server";
import {
  ACCOUNT_COOKIE,
  AUTH_COOKIE,
  PLATFORM_OPS_COOKIE,
  ROLE_COOKIE,
} from "@/lib/account-context";

export const AUTH_COOKIE_NAMES = [
  AUTH_COOKIE,
  ACCOUNT_COOKIE,
  ROLE_COOKIE,
  PLATFORM_OPS_COOKIE,
] as const;

export function clearAuthCookiesOn<T extends NextResponse>(response: T): T {
  for (const name of AUTH_COOKIE_NAMES) {
    response.cookies.delete(name);
  }
  return response;
}
