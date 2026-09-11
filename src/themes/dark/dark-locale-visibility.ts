import type { SiteLocale } from "@/lib/site-i18n";

/** Same visibility gate as LocaleSwitcherBase — avoid empty chrome wrappers. */
export function darkLocaleSwitcherVisible(
  showLocaleSwitcher: boolean,
  supportedLocales: readonly SiteLocale[],
): boolean {
  return showLocaleSwitcher && supportedLocales.length >= 2;
}
