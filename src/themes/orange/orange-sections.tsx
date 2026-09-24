import { collectPublicContactChannels, type PublicContactChannel } from "@/lib/public-contact-channels";
import { representativeListingPhoto } from "@/lib/representative-listing-photo";
import Link from "next/link";
import type { PublicListingCard } from "@/lib/listing-types";
import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  pickLocalized,
  type PublicLocation,
} from "@/lib/public-site-content";
import {
  fillTemplate,
  localizeSiteHref,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { publicContactChannels } from "@/lib/public-contact-channels";
import { OrangeCoverImage } from "@/themes/orange/orange-cover-image";
import {
  OrangeIconArrowRight,
  OrangeIconCalendar,
  OrangeIconMail,
  OrangeIconLocation,
  OrangeIconPhone,
  OrangeIconWhatsApp,
} from "@/themes/orange/orange-icons";
import { OrangeReveal } from "@/themes/orange/orange-reveal";
import { OrangeSocialLinks } from "@/themes/orange/orange-social-links";

type Shared = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function OrangeLocations({
  locations,
  listings,
  locale,
  defaultLocale,
  dict,
}: {
  locations: PublicLocation[];
  listings: PublicListingCard[];
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
}) {
  const items = locations
    .map((location) => {
      const city = location.filter.city?.trim();
      if (!city) return null;
      const href = localizedHref("/", locale, { city }, defaultLocale);
      const configured = location.imageUrl?.trim() || null;
      const listingPhoto = configured
        ? null
        : representativeListingPhoto(location.filter.city, listings);
      return {
        location,
        href,
        imageSrc: configured || listingPhoto,
        fromListing: Boolean(!configured && listingPhoto),
      };
    })
    .filter(
      (
        item,
      ): item is {
        location: PublicLocation;
        href: string;
        imageSrc: string | null;
        fromListing: boolean;
      } => Boolean(item),
    );

  if (items.length === 0) return null;

  const isSingle = items.length === 1;

  return (
    <section
      className={
        isSingle ? "orange-locations orange-locations--single" : "orange-locations"
      }
      aria-labelledby="orange-locations-title"
    >
      <div
        className={
          isSingle ? "orange-shell orange-locations__split" : "orange-shell"
        }
      >
        <OrangeReveal variant="up">
          <div
            className={
              isSingle
                ? "orange-locations__copy"
                : "orange-section__head--center"
            }
          >
            <p className="orange-eyebrow">{dict.locations.eyebrow}</p>
            <h2 id="orange-locations-title" className="orange-section__title">
              {dict.locations.title}
            </h2>
            <p className="orange-lead">{dict.locations.description}</p>
            <hr className="orange-rule" />
          </div>
        </OrangeReveal>
        <ul
          className={`orange-locations__grid ${
            isSingle
              ? "orange-locations__grid--single"
              : "orange-locations__grid--multi"
          }`}
        >
          {items.map(({ location, href, imageSrc, fromListing }, index) => {
              const description = pickLocalized(
                location.shortDescription,
                locale,
              );
              const alt = fromListing
                ? fillTemplate(dict.locations.representativeAlt, {
                    name: location.name,
                  })
                : pickLocalized(location.imageAlt, locale) ||
                  fillTemplate(dict.locations.fallbackAlt, {
                    name: location.name,
                  });

              return (
                <li key={location.id}>
                  <OrangeReveal variant="zoom" delayMs={(index % 3) * 100}>
                    <Link href={href} className="orange-location-card group">
                      <div className="orange-location-card__media">
                        {imageSrc ? (
                          <OrangeCoverImage
                            src={imageSrc}
                            alt={alt}
                            className="orange-img-zoom absolute inset-0 h-full w-full object-cover"
                            placeholderClassName="orange-hero-frame__placeholder"
                            placeholder=""
                          />
                        ) : (
                          <div className="orange-hero-frame__placeholder" />
                        )}
                      </div>
                      <div className="orange-location-card__overlay" aria-hidden />
                      <div className="orange-location-card__body">
                        <h3 className="orange-location-card__name">
                          {location.name}
                        </h3>
                        {description ? (
                          <p className="orange-location-card__excerpt line-clamp-2">
                            {description}
                          </p>
                        ) : null}
                        <span className="orange-location-cta">
                          {dict.locations.cta}
                          <OrangeIconArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </OrangeReveal>
                </li>
              );
            })}
        </ul>
      </div>
    </section>
  );
}


export function OrangeAbout({
  imageUrl,
  content,
  dict,
  locale,
  defaultLocale,
}: Shared & { imageUrl?: string }) {
  const { about } = content;
  const ctaHref = about.cta
    ? localizeSiteHref(about.cta.href, locale, defaultLocale)
    : localizedHref("/#catalogo", locale, null, defaultLocale);

  return (
    <section id="about" className="orange-about">
      <div className="orange-shell">
        <div className="orange-about__grid">
          <OrangeReveal variant="left">
            <div className="orange-about__copy">
              <p className="orange-eyebrow">{dict.about.kicker}</p>
              <h2 className="orange-section__title">{dict.about.title}</h2>
              <p className="orange-lead">{dict.about.description}</p>
              <ul className="orange-about__benefits">
                <li>{dict.about.benefit1}</li>
                <li>{dict.about.benefit2}</li>
                <li>{dict.about.benefit3}</li>
              </ul>
              {about.cta ? (
                <Link href={ctaHref} className="orange-btn orange-about__cta">
                  {dict.about.cta}
                </Link>
              ) : null}
            </div>
          </OrangeReveal>
          <OrangeReveal variant="left">
            <div className="orange-about__media">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={dict.about.title}
                  className="orange-about__image"
                  loading="lazy"
                />
              ) : (
                <div className="orange-about__placeholder" aria-hidden="true" />
              )}
            </div>
          </OrangeReveal>
        </div>
      </div>
    </section>
  );
}

export function OrangeProcess({ dict }: Pick<Shared, "dict">) {
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
    <section id="process" className="orange-process">
      <div className="orange-shell">
        <OrangeReveal variant="up" className="orange-process__head">
          <div className="orange-section__head--center">
            <p className="orange-eyebrow orange-eyebrow--on-dark">
              {dict.process.kicker}
            </p>
            <h2 className="orange-section__title orange-section__title--on-dark">
              {dict.process.title}
            </h2>
            <p className="orange-lead orange-lead--on-dark">
              {dict.process.subtitle}
            </p>
            <hr className="orange-rule" />
          </div>
        </OrangeReveal>
        <ol className="orange-process__steps">
          {steps.map((step, index) => (
            <li key={step.number} className="orange-process__step">
              <OrangeReveal
                variant="up"
                delayMs={index * 100}
                className="orange-process__reveal"
              >
                <div className="orange-process-card">
                  <p className="orange-process-card__mark">{step.number}</p>
                  <h3 className="orange-process-card__title">{step.title}</h3>
                  <p className="orange-process-card__copy">{step.description}</p>
                </div>
              </OrangeReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ChannelIcon({ name }: { name: PublicContactChannel["icon"] }) {
  if (name === "whatsapp") return <OrangeIconWhatsApp className="h-5 w-5" />;
  if (name === "phone") return <OrangeIconPhone className="h-5 w-5" />;
  if (name === "email") return <OrangeIconMail className="h-5 w-5" />;
  if (name === "schedule") return <OrangeIconCalendar className="h-5 w-5" />;
  return <OrangeIconLocation className="h-5 w-5" />;
}

export function OrangeContact({
  content,
  dict,
  description,
}: Pick<Shared, "content" | "dict"> & { description: string }) {
  const { contact, social } = content;
  const whatsappHref = publicContactChannels(content).whatsappHref;
  const channels = collectPublicContactChannels(content, dict);
  const title = content.finalCta.title || dict.finalCta.title;

  return (
    <section
      id="contact"
      className="orange-contact"
      aria-labelledby="orange-contact-title"
    >
      <div className="orange-shell">
        <div className="orange-contact__panel">
          <OrangeReveal variant="up" className="orange-contact__header">
            <p className="orange-eyebrow orange-eyebrow--on-dark">
              {dict.contact.kicker}
            </p>
            <h2
              id="orange-contact-title"
              className="orange-section__title orange-section__title--on-dark"
            >
              {dict.contact.heading}
            </h2>
            <p className="orange-lead orange-lead--on-dark">
              {dict.contact.description}
            </p>
          </OrangeReveal>
          <div className="orange-contact__grid">
            <OrangeReveal variant="left">
              {channels.length > 0 ? (
                <ul className="orange-channels">
                  {channels.map((channel) => {
                    const body = (
                      <>
                        <span className="orange-channel__icon" aria-hidden>
                          <ChannelIcon name={channel.icon} />
                        </span>
                        <span className="orange-channel__copy">
                          <span className="orange-channel__eyebrow">
                            {channel.eyebrow}
                          </span>
                          <span className="orange-channel__value">{channel.value}</span>
                        </span>
                      </>
                    );
                    return (
                      <li key={channel.key}>
                        {channel.href ? (
                          <a
                            href={channel.href}
                            className="orange-channel"
                            aria-label={
                              channel.external
                                ? `${channel.eyebrow}: ${channel.value}. ${dict.a11y.opensInNewTab}`
                                : `${channel.eyebrow}: ${channel.value}`
                            }
                            {...(channel.external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {body}
                          </a>
                        ) : (
                          <p className="orange-channel orange-channel--static">{body}</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="orange-lead orange-lead--on-dark">
                  {dict.contact.emptyChannels}
                </p>
              )}

              <div className="orange-contact__social">
                <OrangeSocialLinks
                  social={social}
                  dict={dict}
                  heading={dict.footer.follow}
                />
              </div>
              {contact.attentionNote ? (
                <p className="orange-contact__note">{contact.attentionNote}</p>
              ) : null}
            </OrangeReveal>

            <OrangeReveal variant="left" delayMs={80}>
              <div className="orange-contact__cta">
                <h3 className="orange-section__title">{title}</h3>
                <p className="orange-lead">{description}</p>
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    className="orange-btn orange-btn--dark"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
                  >
                    <OrangeIconWhatsApp className="h-5 w-5" aria-hidden />
                    {dict.whatsapp.label}
                  </a>
                ) : null}
              </div>
            </OrangeReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
