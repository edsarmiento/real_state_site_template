import { fillTemplate } from "@/lib/site-i18n";
import { ElegantFooter } from "@/themes/elegant/elegant-footer";
import { ElegantHeader } from "@/themes/elegant/elegant-header";
import { ElegantShell } from "@/themes/elegant/elegant-shell";
import { getElegantUi } from "@/themes/elegant/elegant-ui";
import type { ListingLoadErrorThemeProps } from "@/themes/theme-types";

export function ElegantListingLoadError({
  status,
  lang,
  content,
  config,
  locale,
}: ListingLoadErrorThemeProps) {
  const { dict } = getElegantUi({ content, config, locale });
  const message = fillTemplate(dict.results.listingError, { status });

  return (
    <ElegantShell lang={lang}>
      <ElegantHeader lang={lang} />
      <main className="elegant-legal">
        <div className="elegant-shell">
          <p className="elegant-state">{message}</p>
        </div>
      </main>
      <ElegantFooter lang={lang} />
    </ElegantShell>
  );
}
