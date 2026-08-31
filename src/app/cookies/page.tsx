import { legalPlaceholderMetadata } from "@/lib/legal-placeholder";
import { resolveSiteThemeFromConfig } from "@/themes/resolve-site-theme";
import { DefaultLegalPage } from "@/themes/default/default-legal-page";
import { LuxuryLegalPage } from "@/themes/luxury/luxury-legal-page";

export const metadata = legalPlaceholderMetadata("Política de cookies");

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function param(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export default async function CookiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const theme = await resolveSiteThemeFromConfig();
  const lang = param((await searchParams).lang);
  if (theme.name === "luxury") {
    return <LuxuryLegalPage kind="cookies" lang={lang} />;
  }
  return <DefaultLegalPage kind="cookies" />;
}