import type { PublicSiteContent } from "@/lib/public-site-content";
import { pickLocalized } from "@/lib/public-site-content";
import { localizeSiteHref, type SiteDictionary, type SiteLocale } from "@/lib/site-i18n";
import { OrangeContactForm } from "@/themes/orange/orange-contact-form";
import type { OrangeCopy } from "@/themes/orange/orange-copy";
import {
  OrangeIconCatalog,
  OrangeIconChat,
  OrangeIconListing,
  OrangeIconPhone,
  OrangeIconStar,
  OrangeIconWhatsApp,
} from "@/themes/orange/orange-icons";
import { OrangeReveal } from "@/themes/orange/orange-reveal";

type LocaleProps = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  copy: OrangeCopy;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

function testimonialInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase())
    .join("");
}

export function OrangeServices({ copy }: { copy: OrangeCopy }) {
  const items = [
    { icon: OrangeIconListing, title: copy.service1Title, body: copy.service1Body },
    { icon: OrangeIconChat, title: copy.service2Title, body: copy.service2Body },
    { icon: OrangeIconCatalog, title: copy.service3Title, body: copy.service3Body },
  ];
  return (
    <section id="servicios" className="orange-section orange-section--bordered">
      <OrangeReveal>
        <div className="orange-section__intro orange-section__intro--wide">
          <span className="orange-kicker">{copy.servicesEyebrow}</span>
          <h2 className="orange-section__title">{copy.servicesTitle}</h2>
          <p className="orange-section__lead">{copy.servicesDescription}</p>
        </div>
      </OrangeReveal>
      <div className="orange-services">
        {items.map((item, index) => (
          <OrangeReveal key={item.title} delayMs={(index + 1) * 100}>
            <article className="orange-service">
              <div className="orange-service__icon">
                <item.icon className="h-6 w-6" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          </OrangeReveal>
        ))}
      </div>
    </section>
  );
}

/**
 * Dark editorial block. Renders configured testimonials when they exist and
 * otherwise keeps the same three-card composition with service principles,
 * without quotes, stars, avatars or invented names.
 */
export function OrangeExperience({
  content,
  dict,
  copy,
  locale,
}: {
  content: PublicSiteContent;
  dict: SiteDictionary;
  copy: OrangeCopy;
  locale: SiteLocale;
}) {
  const testimonials = content.testimonials.flatMap((item) => {
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
  const hasTestimonials = testimonials.length > 0;
  const principles = [
    { title: copy.principle1Title, body: copy.principle1Body },
    { title: copy.principle2Title, body: copy.principle2Body },
    { title: copy.principle3Title, body: copy.principle3Body },
  ];
  const isPreview = testimonials.some((item) => item.preview);

  return (
    <section
      id={hasTestimonials ? "testimonios" : "principios"}
      className="orange-testimonials"
    >
      <OrangeReveal>
        <div className="orange-section__intro orange-section__intro--wide orange-section__intro--dark">
          <span className="orange-kicker">
            {hasTestimonials ? dict.testimonials.eyebrow : copy.principlesEyebrow}
          </span>
          <h2 className="orange-section__title">
            {hasTestimonials ? dict.testimonials.title : copy.principlesTitle}
          </h2>
          {isPreview ? (
            <p className="orange-section__lead">{dict.testimonials.previewNote}</p>
          ) : null}
        </div>
      </OrangeReveal>
      <div className="orange-testimonials__grid">
        {hasTestimonials
          ? testimonials.map((item, index) => (
              <OrangeReveal key={item.id} delayMs={(index + 1) * 100}>
                <article className="orange-quote">
                  <p className="orange-quote__stars" aria-hidden>
                    {Array.from({ length: 5 }).map((_, star) => (
                      <OrangeIconStar key={star} className="h-3.5 w-3.5" />
                    ))}
                  </p>
                  <p className="orange-quote__text">“{item.quote}”</p>
                  <footer>
                    <span className="orange-quote__avatar" aria-hidden>
                      {testimonialInitials(item.name)}
                    </span>
                    <div>
                      <p>{item.name}</p>
                      {item.role ? <p>{item.role}</p> : null}
                    </div>
                  </footer>
                </article>
              </OrangeReveal>
            ))
          : principles.map((item, index) => (
              <OrangeReveal key={item.title} delayMs={(index + 1) * 100}>
                <article className="orange-quote orange-quote--principle">
                  <h3>{item.title}</h3>
                  <p className="orange-quote__text">{item.body}</p>
                </article>
              </OrangeReveal>
            ))}
      </div>
    </section>
  );
}

export function OrangeAbout({ content }: { content: PublicSiteContent }) {
  const title = content.about.title.trim();
  if (!title) return null;
  const quote = content.about.description.trim();
  return (
    <section id="nosotros" className="orange-manifesto">
      <OrangeReveal variant="zoom">
        {content.about.kicker ? (
          <span className="orange-kicker orange-kicker--on-terracotta">
            {content.about.kicker}
          </span>
        ) : null}
        <h2 className="orange-section__title">{title}</h2>
        {quote ? <p className="orange-signature">{quote}</p> : null}
      </OrangeReveal>
    </section>
  );
}

export function OrangeContact({
  content,
  dict,
  copy,
  locale,
  defaultLocale,
}: LocaleProps) {
  const whatsappHref = content.whatsapp.href ?? content.contact.whatsappHref;
  const privacyHref = localizeSiteHref(
    content.legal.privacyNoticeUrl,
    locale,
    defaultLocale,
  );
  const whatsappNumber =
    content.whatsapp.number ?? content.contact.whatsappNumber;
  const email = content.contact.email;
  const formChannel = whatsappNumber
    ? ("whatsapp" as const)
    : email
      ? ("email" as const)
      : ("none" as const);
  const hasChannel = Boolean(
    whatsappHref || content.contact.phoneHref || content.contact.emailHref,
  );

  return (
    <section id="contacto" className="orange-section">
      <OrangeReveal>
        <div className="orange-contact-card">
          <div className="orange-contact-card__intro">
            <span className="orange-kicker">{copy.contactEyebrow}</span>
            <h2 className="orange-section__title">{copy.contactTitle}</h2>
            <p className="orange-section__lead">{copy.contactDescription}</p>
          </div>

          {hasChannel ? (
            <div className="orange-contact-actions">
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  className="orange-btn orange-btn--dark orange-contact-action"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <OrangeIconWhatsApp className="h-5 w-5" />
                  {copy.openWhatsApp}
                </a>
              ) : null}
              {content.contact.phoneHref ? (
                <a
                  href={content.contact.phoneHref}
                  className="orange-btn orange-btn--terracotta orange-contact-action"
                >
                  <OrangeIconPhone className="h-5 w-5" />
                  {copy.callNow}
                </a>
              ) : null}
            </div>
          ) : null}

          <OrangeContactForm
            dict={dict}
            copy={copy}
            channel={formChannel}
            whatsappNumber={whatsappNumber}
            email={email}
            privacyHref={privacyHref}
            unavailableNote={copy.formUnavailable}
          />
        </div>
      </OrangeReveal>
    </section>
  );
}
