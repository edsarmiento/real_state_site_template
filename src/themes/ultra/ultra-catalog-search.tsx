"use client";

import {
  useEffect,
  useTransition,
  type FormEvent,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import { PublicCatalogSearch } from "@/components/public-catalog-search";
import type { CatalogOfferFilter } from "@/lib/listing-types";
import type { SiteDictionary, SiteLocale } from "@/lib/site-i18n";

type Props = {
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

function isModifiedClick(event: {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}): boolean {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function isOfferTabLink(root: HTMLElement, link: HTMLAnchorElement): boolean {
  const nav = link.closest("nav");
  if (!nav || !root.contains(nav) || !root.contains(link)) return false;
  const sibling = nav.nextElementSibling;
  return sibling instanceof HTMLFormElement;
}

function destinationWithoutHash(link: HTMLAnchorElement): string | null {
  let url: URL;
  try {
    url = new URL(link.href, window.location.origin);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  url.hash = "";
  return `${url.pathname}${url.search}`;
}

export function UltraCatalogSearch({
  oferta,
  city,
  propertyType,
  bedrooms,
  dict,
  locale,
  defaultLocale,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const catalog = document.getElementById("catalogo");
    if (!catalog) return;
    if (pending) catalog.setAttribute("aria-busy", "true");
    else catalog.removeAttribute("aria-busy");
    return () => catalog.removeAttribute("aria-busy");
  }, [pending]);

  function onOfferTabClick(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || isModifiedClick(event)) return;
    const root = event.currentTarget;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a");
    if (!(link instanceof HTMLAnchorElement)) return;
    if (!isOfferTabLink(root, link)) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    const destination = destinationWithoutHash(link);
    if (!destination) return;

    event.preventDefault();
    event.stopPropagation();
    startTransition(() => {
      router.push(destination, { scroll: false });
    });
  }

  function onSubmit(event: FormEvent<HTMLDivElement>) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();

    const params = new URLSearchParams();
    for (const [key, value] of new FormData(form).entries()) {
      if (typeof value !== "string") continue;
      const trimmed = value.trim();
      if (!trimmed || key === "page") continue;
      params.set(key, trimmed);
    }

    const query = params.toString();
    const href = `${query ? `/?${query}` : "/"}#catalogo`;
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <div
      className={pending ? "ultra-search is-pending" : "ultra-search"}
      data-ultra-search-pending={pending ? "true" : "false"}
      data-ultra-offer-nav="ready"
      onClickCapture={onOfferTabClick}
      onSubmit={onSubmit}
      aria-busy={pending}
    >
      <PublicCatalogSearch
        oferta={oferta}
        city={city}
        propertyType={propertyType}
        bedrooms={bedrooms}
        styledLayout
        dict={dict}
        locale={locale}
        defaultLocale={defaultLocale}
      />
    </div>
  );
}
