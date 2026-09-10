import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  getDictionary,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { resolveThemeProps } from "@/themes/resolve-theme-props";
import type { ThemeResolvedProps } from "@/themes/theme-types";
import { getOrangeCopy, type OrangeCopy } from "@/themes/orange/orange-copy";

export type OrangeUi = {
  content: PublicSiteContent;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  copy: OrangeCopy;
};

/**
 * Pure derivation of Orange UI values from already-resolved integration props.
 * Does not fetch SiteConfig or public content.
 */
export function getOrangeUi({
  content,
  locale,
}: ThemeResolvedProps): OrangeUi {
  return {
    content,
    locale,
    defaultLocale: content.locale.defaultLocale,
    dict: getDictionary(locale),
    copy: getOrangeCopy(locale),
  };
}

/** Async loader for chrome (shell/header/footer) that still takes `lang`. */
export async function loadOrangeUi(lang?: string): Promise<OrangeUi> {
  return getOrangeUi(await resolveThemeProps(lang));
}

export function orangeNavLinks(input: {
  dict: SiteDictionary;
  copy: OrangeCopy;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  showServices: boolean;
  showTestimonials: boolean;
  showAbout: boolean;
}): { href: string; label: string }[] {
  const { dict, copy, locale, defaultLocale } = input;
  const links: { href: string; label: string }[] = [
    {
      href: localizedHref("/#propiedades", locale, null, defaultLocale),
      label: dict.nav.properties,
    },
  ];
  if (input.showServices) {
    links.push({
      href: localizedHref("/#servicios", locale, null, defaultLocale),
      label: copy.navServices,
    });
  }
  links.push(
    input.showTestimonials
      ? {
          href: localizedHref("/#testimonios", locale, null, defaultLocale),
          label: copy.navTestimonials,
        }
      : {
          href: localizedHref("/#principios", locale, null, defaultLocale),
          label: copy.navExperience,
        },
  );
  if (input.showAbout) {
    links.push({
      href: localizedHref("/#nosotros", locale, null, defaultLocale),
      label: dict.nav.about,
    });
  }
  links.push({
    href: localizedHref("/#contacto", locale, null, defaultLocale),
    label: dict.nav.contact,
  });
  return links;
}

function resolveOrangeCurrency(currency?: string | null): string {
  const value = currency?.trim().toUpperCase() ?? "";
  if (/^[A-Z]{3}$/.test(value)) return value;
  return "MXN";
}

export function formatOrangePriceParts(
  cents: number,
  currency: string | null | undefined,
  locale: SiteLocale,
): { amount: string; currency: string } {
  const code = resolveOrangeCurrency(currency);
  const grouped = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(cents / 100));
  return { amount: `$${grouped}`, currency: code };
}
