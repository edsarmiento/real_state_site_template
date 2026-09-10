import { legalPlaceholderMetadata } from "@/lib/legal-placeholder";
import { firstSearchParam } from "@/lib/search-params";
import { resolveSiteThemeFromConfig } from "@/themes/resolve-site-theme";
import { resolveThemeProps } from "@/themes/resolve-theme-props";

export const metadata = legalPlaceholderMetadata("Términos de uso");

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function TermsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const theme = await resolveSiteThemeFromConfig();
  const LegalPage = theme.LegalPage;
  const lang = firstSearchParam((await searchParams).lang);
  const themeProps = await resolveThemeProps(lang);
  return <LegalPage {...themeProps} kind="terms" lang={lang} />;
}
