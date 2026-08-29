import { AdminShell } from "@/components/admin-shell";
import { requireStaffAccess } from "@/lib/route-guards";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaffAccess();

  return <AdminShell>{children}</AdminShell>;
}
