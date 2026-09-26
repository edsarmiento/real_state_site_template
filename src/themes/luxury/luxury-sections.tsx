import { collectPublicContactChannels, publicContactChannels } from "@/lib/public-contact-channels";
import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  localizeSiteHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { LuxuryButton } from "@/themes/luxury/luxury-button";
import {
  LuxuryContactChannels,
} from "@/themes/luxury/luxury-contact-channels";
import { LuxuryReveal } from "@/themes/luxury/luxury-reveal";
import { LuxurySocialLinks } from "@/themes/luxury/luxury-social-links";
import { LuxuryWhatsAppLink } from "@/themes/luxury/luxury-whatsapp-link";

type LocaleProps = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  locale?: SiteLocale;
  defaultLocale?: SiteLocale;
};

export function LuxuryAbout({
  imageUrl,
  content,
  dict,
  locale = "es",
  defaultLocale = "es",
}: LocaleProps & { imageUrl?: string }) {
  const { about, brand } = content;
  const mark = (about.badge?.value || brand.name).trim();

  return (
    <section id="about" className="luxury-section luxury-about">
      <LuxuryReveal>
        <div className="luxury-section__inner luxury-about__layout">
          <div className="luxury-about__copy">
            <p className="luxury-kicker">{dict.about.kicker}</p>
            <h2 className="luxury-section__title">{dict.about.title}</h2>
            <p className="luxury-section__lead">{dict.about.description}</p>
            <ul className="luxury-about__benefits">
              <li>{dict.about.benefit1}</li>
              <li>{dict.about.benefit2}</li>
              <li>{dict.about.benefit3}</li>
            </ul>
            {about.cta ? (
              <LuxuryButton
                href={localizeSiteHref(about.cta.href, locale, defaultLocale)}
                variant="gold"
              >
                {dict.about.cta}
              </LuxuryButton>
            ) : null}
          </div>

          <div className="luxury-about__media">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={dict.about.title}
                className="luxury-about__image"
                loading="lazy"
              />
            ) : (
              <div className="luxury-about__fallback" aria-hidden>
                <span className="luxury-about__wash" />
                <span className="luxury-about__grain" />
                <span className="luxury-about__rule luxury-about__rule--h" />
                <span className="luxury-about__rule luxury-about__rule--v" />
                <span className="luxury-about__frame" />
                <span className="luxury-about__accent" />
                <span className="luxury-about__wordmark">{mark}</span>
              </div>
            )}
          </div>
        </div>
      </LuxuryReveal>
    </section>
  );
}

export function LuxuryProcess({ dict }: Pick<LocaleProps, "dict">) {
  const steps = [
    {
      number: "01",
      title: dict.process.step1Title,
      description: dict.process.step1Description,
    },
    {
      number: "02",
      title: dict.process.step2Title,
      description: dict.process.step2Description,
    },
    {
      number: "03",
      title: dict.process.step3Title,
      description: dict.process.step3Description,
    },
  ];

  return (
    <section id="process" className="luxury-section luxury-process">
      <LuxuryReveal>
        <div className="luxury-section__inner">
          <p className="luxury-kicker luxury-kicker--on-dark">
            {dict.process.kicker}
          </p>
          <h2 className="luxury-section__title">{dict.process.title}</h2>
          <p className="luxury-section__lead luxury-section__lead--on-dark">
            {dict.process.subtitle}
          </p>
          <ol className="luxury-process__steps">
            {steps.map((step) => (
              <li key={step.number} className="luxury-process__step">
                <span className="luxury-process__number" aria-hidden>
                  {step.number}
                </span>
                <h3 className="luxury-process__title">{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </LuxuryReveal>
    </section>
  );
}

export function LuxuryContact({
  content,
  dict,
  description,
}: Pick<LocaleProps, "content" | "dict"> & { description: string }) {
  const { contact, social } = content;
  const whatsapp = publicContactChannels(content).whatsappHref;
  const channels = collectPublicContactChannels(content, dict);

  return (
    <section
      id="contact"
      className="luxury-section luxury-contact"
      aria-labelledby="luxury-contact-title"
    >
      <LuxuryReveal>
        <div className="luxury-section__inner luxury-contact__shell">
          <div className="luxury-contact__header">
            <p className="luxury-kicker">{dict.contact.kicker}</p>
            <h2 id="luxury-contact-title" className="luxury-section__title luxury-contact__title">
              {dict.contact.heading}
            </h2>
            <p className="luxury-section__lead">{dict.contact.description}</p>
          </div>
          <div className="luxury-contact__layout">
            <div className="luxury-contact__intro">
              <LuxuryContactChannels channels={channels} dict={dict} />
              {channels.length === 0 ? (
                <p className="luxury-section__lead">{dict.contact.emptyChannels}</p>
              ) : null}
              <LuxurySocialLinks
                social={social}
                dict={dict}
                heading={dict.footer.follow}
              />
              {contact.attentionNote ? (
                <p className="luxury-contact__note">{contact.attentionNote}</p>
              ) : null}
            </div>
            <div className="luxury-contact__cta">
              <h3 className="luxury-section__title">
                {content.finalCta.title || dict.finalCta.title}
              </h3>
              <p className="luxury-section__lead luxury-section__lead--on-dark">
                {description}
              </p>
              {whatsapp ? (
                <LuxuryWhatsAppLink
                  href={whatsapp}
                  ariaLabel={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
                >
                  {dict.whatsapp.label}
                </LuxuryWhatsAppLink>
              ) : null}
            </div>
          </div>
        </div>
      </LuxuryReveal>
    </section>
  );
}
