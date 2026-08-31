import { cookies } from "next/headers";
import { AUTH_COOKIE, ACCOUNT_HEADER } from "@/lib/account-context";
import { accountId } from "@/lib/site-config-env";

/** JWT + X-Account-Id fixed to this deploy's ACCOUNT_ID. */
export async function getBearerAuthHeaders(options?: {
  omitContentType?: boolean;
}): Promise<Record<string, string> | null> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    [ACCOUNT_HEADER]: String(accountId()),
  };

  if (!options?.omitContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}
