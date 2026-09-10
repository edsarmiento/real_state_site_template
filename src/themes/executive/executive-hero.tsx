"use client";

import Link from "next/link";
import { useState } from "react";
import type { CatalogOfferFilter } from "@/lib/listing-types";
import type { SiteDictionary, SiteLocale } from "@/lib/site-i18n";
import type { ExecutiveCopy } from "@/themes/executive/executive-copy";
import { ExecutiveHeroCollage } from "@/themes/executive/executive-hero-collage";
import { ExecutiveIconStar } from "@/themes/executive/executive-icons";
import { ExecutiveSearch } from "@/themes/executive/executive-search";

type Props = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  photoUrls: string[];
  photoTitle: string;
  photoAltTemplate: string;
  plaque: string;
  brandInitial: string;
  oferta: CatalogOfferFilter;
  city: string;
  propertyType: string;
  bedrooms: string;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  copy: ExecutiveCopy;
};

export function ExecutiveHero({
  eyebrow,
  titleLead,
  titleAccent,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  photoUrls,
  photoTitle,
  photoAltTemplate,
  plaque,
  brandInitial,
  oferta,
  city,
  propertyType,
  bedrooms,
  locale,
  defaultLocale,
  dict,
  copy,
}: Props) {
  const [cached, setCached] = useState({ urls: photoUrls, title: photoTitle });
  const urls = photoUrls.length > 0 ? photoUrls : cached.urls;
  const title = photoUrls.length > 0 ? photoTitle : cached.title;
  if (
    photoUrls.length > 0 &&
    (cached.title !== photoTitle ||
      cached.urls.length !== photoUrls.length ||
      cached.urls.some((url, index) => url !== photoUrls[index]))
  ) {
    setCached({ urls: photoUrls, title: photoTitle });
  }

  return (
    <section className="executive-hero">
      <div className="executive-hero__atmosphere" aria-hidden>
        <div className="executive-hero__grain" />
        <div className="executive-hero__glow executive-hero__glow--sand" />
        <div className="executive-hero__glow executive-hero__glow--cyan" />
      </div>
      <div className="executive-shell executive-hero__grid">
        <div className="executive-hero__copy">
          <p className="executive-hero__badge">
            <ExecutiveIconStar className="h-2.5 w-2.5" />
            <span>{eyebrow}</span>
          </p>
          <div className="executive-hero__intro">
            <h1 className="executive-hero__title">
              {titleLead ? `${titleLead} ` : null}
              {titleAccent ? <em>{titleAccent}</em> : null}
            </h1>
            <p className="executive-hero__lead">{subtitle}</p>
          </div>
          <div className="executive-hero__actions">
            <Link href={primaryHref} className="executive-btn">
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className="executive-btn executive-btn--ghost">
              {secondaryLabel}
            </Link>
          </div>
        </div>
        <div className="executive-hero__media">
          <ExecutiveHeroCollage
            urls={urls}
            title={title}
            photoAltTemplate={photoAltTemplate}
            plaque={plaque}
            brandInitial={brandInitial}
          />
        </div>
      </div>
      <div className="executive-shell executive-hero__search">
        <ExecutiveSearch
          oferta={oferta}
          city={city}
          propertyType={propertyType}
          bedrooms={bedrooms}
          locale={locale}
          defaultLocale={defaultLocale}
          dict={dict}
          copy={copy}
        />
      </div>
    </section>
  );
}
