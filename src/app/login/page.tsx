import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteLayoutVariantProvider } from "@/components/site-layout-variant-provider";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import { isStyledSiteLayout } from "@/lib/site-layout-variant";
import { pickSiteBranding } from "@/lib/site-branding";
import { LoginForm } from "./login-form";
import { LoginLoading } from "./login-loading";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default async function LoginPage() {
  const config = await getResolvedSiteConfig();
  const branding = pickSiteBranding(config);
  const styledLayout = isStyledSiteLayout(config.layoutKey);

  return (
    <SiteLayoutVariantProvider styled={styledLayout}>
      <Suspense fallback={<LoginLoading {...branding} styledLayout={styledLayout} />}>
        <LoginForm {...branding} styledLayout={styledLayout} />
      </Suspense>
    </SiteLayoutVariantProvider>
  );
}
