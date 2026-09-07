import Link from "next/link";
import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  localizeSiteHref,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";

type Props = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function UltraAbout({ content, dict, locale, defaultLocale }: Props) {
  const { about } = content;
  const ctaHref = about.cta
    ? localizeSiteHref(about.cta.href, locale, defaultLocale)
    : localizedHref("/#catalogo", locale, null, defaultLocale);
  const imageUrl = about.imageUrl?.trim() || null;

  return (
    <section id="about" className="ultra-about">
      <div className="ultra-shell ultra-about__grid">
        <div className="ultra-about__copy">
          <p className="ultra-eyebrow">{dict.about.kicker}</p>
          <h2 className="ultra-section-title">{dict.about.title}</h2>
          <p className="ultra-lead">{dict.about.description}</p>
          <ul className="ultra-about__benefits">
            <li>{dict.about.benefit1}</li>
            <li>{dict.about.benefit2}</li>
            <li>{dict.about.benefit3}</li>
          </ul>
          <Link href={ctaHref} className="ultra-btn">
            {dict.about.cta}
          </Link>
        </div>
        {imageUrl ? (
          <div className="ultra-about__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={dict.about.title}
              className="ultra-about__image"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
