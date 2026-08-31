import { AdminShell } from "@/components/admin-shell";
import { requireStaffAccess } from "@/lib/route-guards";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaffAccess();
  const config = await getResolvedSiteConfig();

  return (
    <AdminShell siteName={config.siteName} siteLogoUrl={config.siteLogoUrl}>
      {children}
    </AdminShell>
  );
}
