import { cookies } from "next/headers";
import { cache } from "react";
import {
  ACCOUNT_COOKIE,
  AUTH_COOKIE,
  fetchCurrentUserWithToken,
  findMembership,
  membershipGrantsAdminAccess,
} from "@/lib/account-context";
import {
  isExternalPortalRole,
  isPropertyOwnerPortalRole,
  isTenantPortalRole,
} from "@/lib/access-control";
import type { Membership } from "@/lib/account-types";

export type SessionContext = {
  token: string;
  email: string;
  memberships: Membership[];
  accountId: string | null;
  membership: Membership | undefined;
  emailConfirmed: boolean;
  isTenantPortalUser: boolean;
  isPropertyOwnerPortalUser: boolean;
  isStaffUser: boolean;
  isPlatformOps: boolean;
  isPortalUser: boolean;
};

export const getSessionContext = cache(async function getSessionContext(): Promise<SessionContext | null> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const user = await fetchCurrentUserWithToken(token);
  if (!user) return null;

  const memberships = user.memberships;
  const accountId = jar.get(ACCOUNT_COOKIE)?.value ?? null;
  const membership = findMembership(memberships);
  const role = membership?.role;
  const isPlatformOps = user.platform_ops === true;

  const isTenantPortalUser = !isPlatformOps && isTenantPortalRole(role);
  const isPropertyOwnerPortalUser =
    !isPlatformOps && isPropertyOwnerPortalRole(role);
  const isStaffUser =
    !isPlatformOps &&
    membershipGrantsAdminAccess(membership) &&
    !isExternalPortalRole(role);

  return {
    token,
    email: user.email,
    memberships,
    accountId,
    membership,
    emailConfirmed: user.email_confirmed,
    isTenantPortalUser,
    isPropertyOwnerPortalUser,
    isStaffUser,
    isPlatformOps,
    isPortalUser: isTenantPortalUser,
  };
});
