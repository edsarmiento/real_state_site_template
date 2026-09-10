import { fillTemplate } from "@/lib/site-i18n";
import { ExecutiveFooter } from "@/themes/executive/executive-footer";
import { ExecutiveHeader } from "@/themes/executive/executive-header";
import { ExecutiveShell } from "@/themes/executive/executive-shell";
import { getExecutiveUi } from "@/themes/executive/executive-ui";
import type { ListingLoadErrorThemeProps } from "@/themes/theme-types";

export async function ExecutiveListingLoadError({
  status,
  lang,
}: ListingLoadErrorThemeProps) {
  const { dict } = await getExecutiveUi(lang);
  const message = fillTemplate(dict.results.listingError, { status });

  return (
    <ExecutiveShell lang={lang}>
      <ExecutiveHeader lang={lang} />
      <main className="executive-legal">
        <p className="executive-state">{message}</p>
      </main>
      <ExecutiveFooter lang={lang} />
    </ExecutiveShell>
  );
}
