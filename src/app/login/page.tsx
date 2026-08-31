import type { Metadata } from "next";
import { Suspense } from "react";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import { pickSiteBranding } from "@/lib/site-branding";
import { LoginForm } from "./login-form";
import { LoginLoading } from "./login-loading";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default async function LoginPage() {
  const config = await getResolvedSiteConfig();
  const branding = pickSiteBranding(config);

  return (
    <Suspense fallback={<LoginLoading {...branding} />}>
      <LoginForm {...branding} />
    </Suspense>
  );
}
