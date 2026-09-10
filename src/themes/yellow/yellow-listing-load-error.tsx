import Link from "next/link";
import { fillTemplate, localizedHref } from "@/lib/site-i18n";
import { YellowFooter } from "@/themes/yellow/yellow-footer";
import { YellowHeader } from "@/themes/yellow/yellow-header";
import { YellowShell } from "@/themes/yellow/yellow-shell";
import { getYellowUi } from "@/themes/yellow/yellow-ui";
import type { ListingLoadErrorThemeProps } from "@/themes/theme-types";

export async function YellowListingLoadError({
  status,
  lang,
}: ListingLoadErrorThemeProps) {
  const { dict, locale, defaultLocale } = await getYellowUi(lang);
  const message = fillTemplate(dict.results.listingError, { status });

  return (
    <YellowShell lang={lang}>
      <YellowHeader lang={lang} />
      <main className="yellow-legal">
        <div className="yellow-shell yellow-state">
          <h1 className="yellow-section__title">{message}</h1>
          <Link
            href={localizedHref("/", locale, null, defaultLocale)}
            className="yellow-btn"
          >
            {dict.results.viewAll}
          </Link>
        </div>
      </main>
      <YellowFooter lang={lang} />
    </YellowShell>
  );
}
