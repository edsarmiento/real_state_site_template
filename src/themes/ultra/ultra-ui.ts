import { getPublicSiteContent } from "@/lib/public-site-content";
import { localizedHref, type SiteDictionary, type SiteLocale } from "@/lib/site-i18n";
import { getSiteUi, type SiteUi } from "@/lib/site-ui";

export type UltraUi = SiteUi & {
  content: Awaited<ReturnType<typeof getPublicSiteContent>>;
};

export async function getUltraUi(lang?: string): Promise<UltraUi> {
  const [ui, content] = await Promise.all([
    getSiteUi(lang),
    getPublicSiteContent(),
  ]);
  return { ...ui, content };
}

export function ultraNavLinks(
  dict: SiteDictionary,
  locale: SiteLocale,
  defaultLocale: SiteLocale,
): { href: string; label: string }[] {
  return [
    {
      href: localizedHref("/#catalogo", locale, null, defaultLocale),
      label: dict.nav.properties,
    },
    {
      href: localizedHref("/#about", locale, null, defaultLocale),
      label: dict.nav.about,
    },
    {
      href: localizedHref("/#process", locale, null, defaultLocale),
      label: dict.nav.process,
    },
    {
      href: localizedHref("/#contact", locale, null, defaultLocale),
      label: dict.nav.contact,
    },
  ];
}
