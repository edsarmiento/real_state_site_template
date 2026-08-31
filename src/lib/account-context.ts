import { apiBaseUrl } from "@/lib/api-url";
import { accountId as workspaceAccountId } from "@/lib/site-config-env";
import type { Membership } from "@/lib/account-types";

function isExternalPortalRole(role: string): boolean {
  return role === "tenant_portal" || role === "property_owner_portal";
}

export const AUTH_COOKIE = "auth_token";
export const ACCOUNT_COOKIE = "account_id";
export const ROLE_COOKIE = "membership_role";
export const PLATFORM_OPS_COOKIE = "platform_ops";
export const ACCOUNT_HEADER = "X-Account-Id";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export { cookieOptions as accountCookieOptions };

export type CurrentUserPayload = {
  id: number;
  email: string;
  platform_ops: boolean;
  email_confirmed: boolean;
  memberships: Membership[];
};

export function parseCurrentUser(data: unknown): CurrentUserPayload | null {
  if (!data || typeof data !== "object") return null;
  const root = data as Record<string, unknown>;
  const user =
    root.user && typeof root.user === "object" && root.user !== null
      ? (root.user as Record<string, unknown>)
      : root;

  if (typeof user.id !== "number" || typeof user.email !== "string") {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    platform_ops: user.platform_ops === true,
    email_confirmed: user.email_confirmed !== false,
    memberships: parseMemberships(data),
  };
}

export function parseMemberships(data: unknown): Membership[] {
  if (!data || typeof data !== "object") return [];
  const root = data as Record<string, unknown>;
  const user =
    root.user && typeof root.user === "object" && root.user !== null
      ? (root.user as Record<string, unknown>)
      : root;
  const raw = user.memberships;
  if (!Array.isArray(raw)) return [];

  const out: Membership[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const m = item as Record<string, unknown>;
    const accountRaw = m.account;
    if (!accountRaw || typeof accountRaw !== "object") continue;
    const a = accountRaw as Record<string, unknown>;
    if (
      typeof m.id !== "number" ||
      typeof m.role !== "string" ||
      typeof a.id !== "number" ||
      typeof a.name !== "string"
    ) {
      continue;
    }
    out.push({
      id: m.id,
      role: m.role,
      status: typeof m.status === "string" ? m.status : "active",
      tenant_id: typeof m.tenant_id === "number" ? m.tenant_id : null,
      property_owner_id:
        typeof m.property_owner_id === "number" ? m.property_owner_id : null,
      portal_profile_name:
        typeof m.portal_profile_name === "string"
          ? m.portal_profile_name
          : null,
      account: {
        id: a.id,
        name: a.name,
        country: typeof a.country === "string" ? a.country : "",
        currency: typeof a.currency === "string" ? a.currency : "MXN",
        timezone: typeof a.timezone === "string" ? a.timezone : "UTC",
        plan: typeof a.plan === "string" ? a.plan : "crm",
        subscription_status:
          typeof a.subscription_status === "string"
            ? a.subscription_status
            : undefined,
        trial_ends_at:
          typeof a.trial_ends_at === "string" ? a.trial_ends_at : null,
        crm_paid_until:
          typeof a.crm_paid_until === "string" ? a.crm_paid_until : null,
        crm_operational:
          typeof a.crm_operational === "boolean"
            ? a.crm_operational
            : undefined,
      },
    });
  }
  return out;
}

/** White-label deploy: session is always scoped to ACCOUNT_ID from env. */
export function findMembership(
  memberships: Membership[],
): Membership | undefined {
  const id = workspaceAccountId();
  return memberships.find((m) => m.account.id === id && m.status !== "disabled");
}

export function pickDefaultAccountId(memberships: Membership[]): number | null {
  const membership = findMembership(memberships);
  return membership?.account.id ?? null;
}

export function roleForAccount(memberships: Membership[]): string | null {
  return findMembership(memberships)?.role ?? null;
}

export function membershipGrantsAdminAccess(
  membership: Membership | undefined,
): boolean {
  if (!membership) return false;
  if (isExternalPortalRole(membership.role)) return false;
  return true;
}

export async function fetchMembershipsWithToken(
  token: string,
): Promise<Membership[]> {
  const user = await fetchCurrentUserWithToken(token);
  return user?.memberships ?? [];
}

export async function fetchCurrentUserWithToken(
  token: string,
): Promise<CurrentUserPayload | null> {
  const res = await fetch(`${apiBaseUrl()}/api/v1/users/me`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return null;
  return parseCurrentUser(await res.json());
}

export async function getCurrentAccountId(): Promise<string | null> {
  return String(workspaceAccountId());
}
