import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session-context";

export type SessionAccess = {
  isTenantPortalUser: boolean;
  isPropertyOwnerPortalUser: boolean;
  isStaffUser: boolean;
  isPlatformOps: boolean;
  isPortalUser: boolean;
};

function toAccess(
  session: NonNullable<Awaited<ReturnType<typeof getSessionContext>>>,
): SessionAccess {
  return {
    isTenantPortalUser: session.isTenantPortalUser,
    isPropertyOwnerPortalUser: session.isPropertyOwnerPortalUser,
    isStaffUser: session.isStaffUser,
    isPlatformOps: session.isPlatformOps,
    isPortalUser: session.isPortalUser,
  };
}

export async function requireStaffAccess(): Promise<
  SessionAccess & { isStaffUser: true }
> {
  const session = await getSessionContext();
  if (!session) redirect("/login");
  if (!session.isStaffUser || !session.membership) {
    redirect("/login?auth=no_access");
  }
  return { ...toAccess(session), isStaffUser: true };
}
