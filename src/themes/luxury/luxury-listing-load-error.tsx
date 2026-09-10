import { fillTemplate } from "@/lib/site-i18n";
import { LuxuryShell } from "@/themes/luxury/luxury-shell";
import { getLuxuryUi } from "@/themes/luxury/luxury-ui";
import type { ListingLoadErrorThemeProps } from "@/themes/theme-types";

export function LuxuryListingLoadError({
  status,
  lang,
  content,
  config,
  locale,
}: ListingLoadErrorThemeProps) {
  const { dict } = getLuxuryUi({ content, config, locale });
  const message = fillTemplate(dict.results.listingError, { status });

  return (
    <LuxuryShell lang={lang}>
      <p className="luxury-state luxury-state--error">{message}</p>
    </LuxuryShell>
  );
}
