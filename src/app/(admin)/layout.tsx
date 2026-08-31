import { AdminShell } from "@/components/admin-shell";
import { SiteLayoutVariantProvider } from "@/components/site-layout-variant-provider";
import { requireStaffAccess } from "@/lib/route-guards";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import { isStyledSiteLayout } from "@/lib/site-layout-variant";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaffAccess();
  const config = await getResolvedSiteConfig();
  const styledLayout = isStyledSiteLayout(config.layoutKey);

  return (
    <SiteLayoutVariantProvider styled={styledLayout}>
      <AdminShell
        siteName={config.siteName}
        siteLogoUrl={config.siteLogoUrl}
        styledLayout={styledLayout}
      >
        {children}
      </AdminShell>
    </SiteLayoutVariantProvider>
  );
}
