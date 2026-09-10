import { fillTemplate } from "@/lib/site-i18n";
import { UltraFooter } from "@/themes/ultra/ultra-footer";
import { UltraHeader } from "@/themes/ultra/ultra-header";
import { UltraShell } from "@/themes/ultra/ultra-shell";
import { getUltraUi } from "@/themes/ultra/ultra-ui";
import type { ListingLoadErrorThemeProps } from "@/themes/theme-types";

export function UltraListingLoadError({
  status,
  lang,
  content,
  config,
  locale,
}: ListingLoadErrorThemeProps) {
  const { dict } = getUltraUi({ content, config, locale });
  const message = fillTemplate(dict.results.listingError, { status });

  return (
    <UltraShell lang={lang}>
      <UltraHeader lang={lang} />
      <main>
        <p className="ultra-load-error">{message}</p>
      </main>
      <UltraFooter lang={lang} />
    </UltraShell>
  );
}
