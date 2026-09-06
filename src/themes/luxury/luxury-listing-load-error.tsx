import { fillTemplate } from "@/lib/site-i18n";
import { LuxuryShell } from "@/themes/luxury/luxury-shell";
import { getLuxuryUi } from "@/themes/luxury/luxury-ui";
import type { ListingLoadErrorThemeProps } from "@/themes/theme-types";

export async function LuxuryListingLoadError({
  status,
  lang,
}: ListingLoadErrorThemeProps) {
  const { dict } = await getLuxuryUi(lang);
  const message = fillTemplate(dict.results.listingError, { status });

  return (
    <LuxuryShell lang={lang}>
      <p className="luxury-state luxury-state--error">{message}</p>
    </LuxuryShell>
  );
}
