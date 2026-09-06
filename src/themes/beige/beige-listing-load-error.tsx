import { fillTemplate } from "@/lib/site-i18n";
import { BeigeFooter } from "@/themes/beige/beige-footer";
import { BeigeHeader } from "@/themes/beige/beige-header";
import { BeigeShell } from "@/themes/beige/beige-shell";
import { getBeigeUi } from "@/themes/beige/beige-ui";
import type { ListingLoadErrorThemeProps } from "@/themes/theme-types";

export async function BeigeListingLoadError({
  status,
  lang,
}: ListingLoadErrorThemeProps) {
  const { dict } = await getBeigeUi(lang);
  const message = fillTemplate(dict.results.listingError, { status });

  return (
    <BeigeShell lang={lang}>
      <BeigeHeader lang={lang} />
      <p className="px-6 py-16 text-center text-[#8A7759]">{message}</p>
      <BeigeFooter lang={lang} />
    </BeigeShell>
  );
}
