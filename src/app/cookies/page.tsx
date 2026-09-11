import { legalPlaceholderMetadata } from "@/lib/legal-placeholder";
import { firstSearchParam } from "@/lib/search-params";
import { getSessionContext } from "@/lib/session-context";
import { resolveSiteThemeFromConfig } from "@/themes/resolve-site-theme";

export const metadata = legalPlaceholderMetadata("Política de cookies");

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CookiesPage({
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
      kind="cookies"
      lang={lang}
      isAdmin={session?.isStaffUser === true}
    />
  );
}
