import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiBaseUrl } from "@/lib/api-url";
import { AUTH_COOKIE } from "@/lib/account-context";
import { AUTH_COOKIE_NAMES } from "@/lib/clear-auth-cookies";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;

  if (token) {
    // DELETE /api/v1/users/sign_out
    await fetch(`${apiBaseUrl()}/api/v1/users/sign_out`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const res = NextResponse.json({ ok: true });
  for (const name of AUTH_COOKIE_NAMES) {
    res.cookies.delete(name);
  }
  return res;
}
