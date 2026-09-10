import { fillTemplate } from "@/lib/site-i18n";
import { ExecutiveFooter } from "@/themes/executive/executive-footer";
import { ExecutiveHeader } from "@/themes/executive/executive-header";
import { ExecutiveShell } from "@/themes/executive/executive-shell";
import { getExecutiveUi } from "@/themes/executive/executive-ui";
import type { ListingLoadErrorThemeProps } from "@/themes/theme-types";

export function ExecutiveListingLoadError({
  status,
  lang,
  content,
  config,
  locale,
}: ListingLoadErrorThemeProps) {
  const { dict } = getExecutiveUi({ content, config, locale });
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
