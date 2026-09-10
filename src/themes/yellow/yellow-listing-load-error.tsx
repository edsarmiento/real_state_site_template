import Link from "next/link";
import { fillTemplate, localizedHref } from "@/lib/site-i18n";
import { YellowFooter } from "@/themes/yellow/yellow-footer";
import { YellowHeader } from "@/themes/yellow/yellow-header";
import { YellowShell } from "@/themes/yellow/yellow-shell";
import { getYellowUi } from "@/themes/yellow/yellow-ui";
import type { ListingLoadErrorThemeProps } from "@/themes/theme-types";

export function YellowListingLoadError({
  status,
  content,
  config,
  locale,
}: ListingLoadErrorThemeProps) {
  const ui = getYellowUi({ content, config, locale });
  const { dict, defaultLocale } = ui;
  const message = fillTemplate(dict.results.listingError, { status });

  return (
    <YellowShell content={content} locale={locale}>
      <YellowHeader ui={ui} />
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
      <YellowFooter ui={ui} />
    </YellowShell>
  );
}
