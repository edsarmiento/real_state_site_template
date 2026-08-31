import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  fillTemplate,
  localizeSiteHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { LuxuryButton } from "@/themes/luxury/luxury-button";
import {
  hasContactChannels,
  LuxuryContactChannels,
} from "@/themes/luxury/luxury-contact-channels";
import { LuxuryContactForm } from "@/themes/luxury/luxury-contact-form";
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
  content,
  dict,
  locale = "es",
  defaultLocale = "es",
}: LocaleProps) {
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
            {about.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={about.imageUrl}
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
  locale = "es",
  defaultLocale = "es",
}: LocaleProps) {
  const { contact, legal, social } = content;
  const catalogHref = localizeSiteHref("#catalogo", locale, defaultLocale);
  const hasChannels = hasContactChannels(contact);

  return (
    <section id="contact" className="luxury-section luxury-contact">
      <LuxuryReveal>
        <div className="luxury-section__inner luxury-contact__shell">
          <div className="luxury-contact__layout">
            <div className="luxury-contact__intro">
              <p className="luxury-kicker">{dict.contact.kicker}</p>
              <h2 className="luxury-section__title luxury-contact__title">
                {dict.contact.heading}
              </h2>
              <p className="luxury-section__lead">{dict.contact.description}</p>
              <LuxuryContactChannels contact={contact} dict={dict} />
              <LuxurySocialLinks
                social={social}
                dict={dict}
                heading={dict.footer.follow}
              />
              {!hasChannels ? (
                <div className="luxury-contact__fallback">
                  <LuxuryButton href={catalogHref} variant="gold">
                    {dict.contact.viewProperties}
                  </LuxuryButton>
                </div>
              ) : null}
              {contact.attentionNote ? (
                <p className="luxury-contact__note">{contact.attentionNote}</p>
              ) : null}
              {contact.imageUrl ? (
                <div className="luxury-contact__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={contact.imageUrl}
                    alt=""
                    className="luxury-contact__image"
                    loading="lazy"
                  />
                </div>
              ) : null}
            </div>
            <LuxuryContactForm
              contact={contact}
              legal={legal}
              dict={dict}
              locale={locale}
              defaultLocale={defaultLocale}
            />
          </div>
        </div>
      </LuxuryReveal>
    </section>
  );
}

export function LuxuryFinalCta({
  content,
  dict,
}: Pick<LocaleProps, "content" | "dict">) {
  const whatsapp = content.whatsapp.href ?? content.contact.whatsappHref;
  const schedule = content.contact.scheduleCallUrl;
  if (!whatsapp && !schedule) return null;

  return (
    <section
      className="luxury-section luxury-final-cta"
      aria-label={dict.contact.finalCtaAria}
    >
      <LuxuryReveal>
        <div className="luxury-section__inner luxury-final-cta__panel">
          <h2 className="luxury-section__title">{dict.finalCta.title}</h2>
          <p className="luxury-section__lead luxury-section__lead--on-dark">
            {fillTemplate(dict.finalCta.description, {
              name: content.brand.name,
            })}
          </p>
          <div className="luxury-final-cta__actions">
            {whatsapp ? (
              <LuxuryWhatsAppLink
                href={whatsapp}
                ariaLabel={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
              >
                {dict.whatsapp.label}
              </LuxuryWhatsAppLink>
            ) : null}
            {schedule ? (
              <LuxuryButton
                href={schedule}
                variant="ghost"
                surface="dark"
                target="_blank"
              >
                {dict.contact.scheduleCall}
              </LuxuryButton>
            ) : null}
          </div>
        </div>
      </LuxuryReveal>
    </section>
  );
}