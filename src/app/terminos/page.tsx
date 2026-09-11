import { legalPlaceholderMetadata } from "@/lib/legal-placeholder";
import { firstSearchParam } from "@/lib/search-params";
import { getSessionContext } from "@/lib/session-context";
import { resolveSiteThemeFromConfig } from "@/themes/resolve-site-theme";

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
  const session = await getSessionContext();
  return (
    <LegalPage
      kind="terms"
      lang={lang}
      isAdmin={session?.isStaffUser === true}
    />
  );
}
