import type { PublicTestimonial } from "@/lib/public-site-content";
import { pickLocalized } from "@/lib/public-site-content";
import type { SiteDictionary, SiteLocale } from "@/lib/site-i18n";
import { LuxuryIconQuote } from "@/themes/luxury/luxury-icons";
import { LuxuryReveal } from "@/themes/luxury/luxury-reveal";

type Props = {
  testimonials: PublicTestimonial[];
  locale: SiteLocale;
  dict: SiteDictionary;
};

export function LuxuryTestimonials({ testimonials, locale, dict }: Props) {
  const resolved = testimonials.flatMap((item) => {
    const quote = pickLocalized(item.quote, locale);
    if (!quote) return [];
    return [
      {
        id: item.id,
        quote,
        name: item.name,
        role: pickLocalized(item.role, locale),
        preview: item.preview === true,
      },
    ];
  });
  if (resolved.length === 0) return null;
  const isPreview = resolved.some((item) => item.preview);

  return (
    <section
      id="testimonials"
      className="luxury-section luxury-testimonials"
      aria-labelledby="luxury-testimonials-title"
    >
      <LuxuryReveal>
        <div className="luxury-section__inner">
          <p className="luxury-kicker">{dict.testimonials.eyebrow}</p>
          <h2 id="luxury-testimonials-title" className="luxury-section__title">
            {dict.testimonials.title}
          </h2>
          {isPreview ? (
            <p className="luxury-testimonials__note" role="note">
              {dict.testimonials.previewNote}
            </p>
          ) : null}
          <ul className="luxury-testimonials__grid">
            {resolved.map((item) => (
              <li key={item.id} className="luxury-testimonials__item">
                <blockquote className="luxury-testimonials__card">
                  <LuxuryIconQuote className="luxury-testimonials__icon" />
                  <p className="luxury-testimonials__quote">{item.quote}</p>
                  <footer className="luxury-testimonials__meta">
                    <cite className="luxury-testimonials__name">
                      {item.name}
                    </cite>
                    {item.role ? (
                      <span className="luxury-testimonials__role">{item.role}</span>
                    ) : null}
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </div>
      </LuxuryReveal>
    </section>
  );
}
