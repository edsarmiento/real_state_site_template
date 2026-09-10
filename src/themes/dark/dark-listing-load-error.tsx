import { fillTemplate } from "@/lib/site-i18n";
import { DarkFooter } from "@/themes/dark/dark-footer";
import { DarkHeader } from "@/themes/dark/dark-header";
import { DarkShell } from "@/themes/dark/dark-shell";
import { getDarkUi } from "@/themes/dark/dark-ui";
import type { ListingLoadErrorThemeProps } from "@/themes/theme-types";

export async function DarkListingLoadError({
  status,
  lang,
}: ListingLoadErrorThemeProps) {
  const { dict } = await getDarkUi(lang);
  const message = fillTemplate(dict.results.listingError, { status });

  return (
    <DarkShell lang={lang}>
      <DarkHeader lang={lang} />
      <main className="dark-legal">
        <div className="dark-shell dark-legal__inner">
          <h1 className="dark-section__title">{message}</h1>
        </div>
      </main>
      <DarkFooter lang={lang} />
    </DarkShell>
  );
}
