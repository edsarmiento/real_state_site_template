import Link from "next/link";
import type { ReactNode } from "react";
import { fillTemplate, localizedHref } from "@/lib/site-i18n";
import type { CatalogThemeProps } from "@/themes/theme-types";
import { OrangeFooter } from "@/themes/orange/orange-footer";
import { OrangeHeader } from "@/themes/orange/orange-header";
import { OrangeListingCard } from "@/themes/orange/orange-listing-card";
import { OrangePagination } from "@/themes/orange/orange-pagination";
import { OrangeReveal } from "@/themes/orange/orange-reveal";
import { OrangeSearch } from "@/themes/orange/orange-search";
import {
  OrangeAbout,
  OrangeContact,
  OrangeExperience,
  OrangeServices,
} from "@/themes/orange/orange-sections";
import { OrangeShell } from "@/themes/orange/orange-shell";
import { OrangeHeroImage } from "@/themes/orange/orange-hero-image";
import {
  OrangeIconBed,
  OrangeIconChat,
  OrangeIconHome,
} from "@/themes/orange/orange-icons";
import { orangeHeroTitleParts } from "@/themes/orange/orange-hero-title";
import { getOrangeUi } from "@/themes/orange/orange-ui";

type OrangeHeroMetric = {
  key: string;
  label: string;
  value?: string;
  icon?: (props: { className?: string }) => ReactNode;
};

export function OrangeCatalog({
  oferta,
  city,
  propertyType,
  bedrooms,
  listings,
  total,
  page = 1,
  pageSize = 12,
  catalogOk,
  catalogStatus,
  lang,
  content,
  config,
  locale,
}: CatalogThemeProps) {
  const { dict, copy, defaultLocale } = getOrangeUi({ content, config, locale });
  const homeHref = localizedHref("/", locale, null, defaultLocale);
  const propertiesHref = localizedHref("/#propiedades", locale, null, defaultLocale);
  const heroImage = content.hero.imageUrl?.trim() || listings[0]?.photo_url || null;
  const heroListing = content.hero.imageUrl ? null : listings[0] ?? null;
  const title = content.hero.title || copy.heroTitle;
  const heroTitle = orangeHeroTitleParts(title, copy.heroTitleAccent);
  const resultsLabel =
    total === 1
      ? copy.availableOne
      : fillTemplate(copy.availableMany, { count: total });
  const configuredStats = content.hero.stats
    .filter((stat) => stat.value.trim() && stat.label.trim())
    .slice(0, 4);
  const metrics: OrangeHeroMetric[] =
    configuredStats.length > 0
      ? configuredStats.map((stat, index) => ({
          key: `stat-${index}`,
          value: stat.value,
          label: stat.label,
        }))
      : catalogOk
        ? [
            {
              key: "published",
              value: String(total),
              label: copy.propertiesAvailable,
            },
            { key: "sale", icon: OrangeIconHome, label: copy.metricSale },
            { key: "rent", icon: OrangeIconBed, label: copy.metricRent },
            { key: "direct", icon: OrangeIconChat, label: copy.metricDirect },
          ]
        : [];
  const emptyKind =
    oferta === "sale"
      ? dict.results.emptySale
      : oferta === "rent"
        ? dict.results.emptyRent
        : "";

  return (
    <OrangeShell lang={lang}>
      <OrangeHeader lang={lang} />

      <section className="orange-hero">
        <div className="orange-hero__grid">
          <OrangeReveal variant="slow" className="orange-hero__reveal-copy">
            <div className="orange-hero__copy">
              <div className="orange-hero__badge">
                <span className="orange-pulse" aria-hidden />
                <span>{copy.heroBadge}</span>
              </div>
              {content.hero.eyebrow ? (
                <p className="orange-hero__eyebrow">{content.hero.eyebrow}</p>
              ) : null}
              <h1 className="orange-hero__title">
                {heroTitle.before}
                {heroTitle.accent ? <em>{heroTitle.accent}</em> : null}
                {heroTitle.after}
              </h1>
              <p className="orange-hero__lead">
                {content.hero.subtitle || copy.heroLead}
              </p>
              <div className="orange-hero__actions">
                <Link href={propertiesHref} className="orange-btn orange-btn--dark">
                  {copy.exploreCta}
                </Link>
              </div>
              {metrics.length > 0 ? (
                <div className="orange-metrics">
                  {metrics.map((metric) => (
                    <div key={metric.key}>
                      {metric.value ? (
                        <p className="orange-metrics__value">{metric.value}</p>
                      ) : metric.icon ? (
                        <p className="orange-metrics__value orange-metrics__value--icon">
                          <metric.icon className="h-6 w-6" />
                        </p>
                      ) : null}
                      <p className="orange-metrics__label">{metric.label}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </OrangeReveal>

          <OrangeReveal variant="left" className="orange-hero__reveal-media">
            <div className="orange-hero__media">
              <div className="orange-hero__frame">
                {heroImage ? (
                  <OrangeHeroImage
                    src={heroImage}
                    alt={heroListing ? heroListing.title : content.brand.name}
                    sizes="(max-width: 1023px) 92vw, 40vw"
                    preload
                    className="orange-hero__image"
                    placeholderClassName="orange-hero__placeholder"
                  />
                ) : (
                  <div className="orange-hero__placeholder" aria-hidden />
                )}
                <div className="orange-hero__caption">
                  <span>
                    {heroListing
                      ? heroListing.offer_type === "sale"
                        ? dict.listing.sale
                        : dict.listing.rent
                      : copy.heroBadge}
                  </span>
                  <p>
                    {heroListing?.title ||
                      content.brand.name}
                  </p>
                  <p>
                    {heroListing?.location_label || content.brand.tagline}
                  </p>
                </div>
              </div>
              <div className="orange-hero__plate" aria-hidden />
            </div>
          </OrangeReveal>
        </div>
      </section>

      <section id="propiedades" className="orange-catalog">
        <OrangeReveal>
          <div className="orange-section__intro">
            <span className="orange-kicker">{copy.catalogEyebrow}</span>
            <h2 className="orange-section__title">{copy.catalogTitle}</h2>
            <p className="orange-section__lead">{copy.catalogDescription}</p>
          </div>
        </OrangeReveal>

        <OrangeSearch
          oferta={oferta}
          city={city}
          propertyType={propertyType}
          bedrooms={bedrooms}
          locale={locale}
          defaultLocale={defaultLocale}
          dict={dict}
          resultsLabel={resultsLabel}
        />

        {!catalogOk ? (
          <p className="orange-state">
            {fillTemplate(dict.results.catalogError, { status: catalogStatus })}
          </p>
        ) : listings.length === 0 ? (
          <div className="orange-state orange-state--card">
            <h2>{dict.results.emptyTitle}</h2>
            <p>
              {dict.results.emptyCopy}
              {emptyKind ? ` ${emptyKind}` : ""}.
            </p>
            <Link href={homeHref} className="orange-btn orange-btn--dark">
              {dict.results.clearFilters}
            </Link>
          </div>
        ) : (
          <>
            <div className="orange-grid">
              {listings.map((listing, index) => (
                <OrangeReveal key={listing.slug} delayMs={(index % 3) * 100}>
                  <OrangeListingCard
                    listing={listing}
                    locale={locale}
                    defaultLocale={defaultLocale}
                    dict={dict}
                    shareLabel={copy.share}
                    shareCopied={copy.shareCopied}
                  />
                </OrangeReveal>
              ))}
            </div>
            <OrangePagination
              oferta={oferta}
              city={city}
              propertyType={propertyType}
              bedrooms={bedrooms}
              page={page}
              total={total}
              pageSize={pageSize}
              locale={locale}
              defaultLocale={defaultLocale}
              copy={copy}
              prevLabel={copy.paginationPrev}
              nextLabel={copy.paginationNext}
            />
          </>
        )}
      </section>

      <OrangeServices copy={copy} />
      <OrangeExperience
        content={content}
        dict={dict}
        copy={copy}
        locale={locale}
      />
      <OrangeAbout content={content} />
      <OrangeContact
        content={content}
        dict={dict}
        copy={copy}
        locale={locale}
        defaultLocale={defaultLocale}
      />
      <OrangeFooter lang={lang} />
    </OrangeShell>
  );
}
