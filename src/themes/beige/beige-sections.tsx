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
import { publicContactChannels as beigeContactChannels } from "@/lib/public-contact-channels";
import { BeigeCoverImage } from "@/themes/beige/beige-cover-image";
import {
  BeigeIconArrowRight,
  BeigeIconCalendar,
  BeigeIconMail,
  BeigeIconMapPin,
  BeigeIconPhone,
  BeigeIconWhatsApp,
} from "@/themes/beige/beige-icons";
import { BeigeReveal } from "@/themes/beige/beige-reveal";
import { BeigeSocialLinks } from "@/themes/beige/beige-social-links";

type Shared = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function BeigeLocations({
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
        isSingle ? "beige-locations beige-locations--single" : "beige-locations"
      }
      aria-labelledby="beige-locations-title"
    >
      <div
        className={
          isSingle ? "beige-shell beige-locations__split" : "beige-shell"
        }
      >
        <BeigeReveal variant="up">
          <div
            className={
              isSingle
                ? "beige-locations__copy"
                : "beige-section__head--center"
            }
          >
            <p className="beige-eyebrow">{dict.locations.eyebrow}</p>
            <h2 id="beige-locations-title" className="beige-section__title">
              {dict.locations.title}
            </h2>
            <p className="beige-lead">{dict.locations.description}</p>
            <hr className="beige-rule" />
          </div>
        </BeigeReveal>
        <ul
          className={`beige-locations__grid ${
            isSingle
              ? "beige-locations__grid--single"
              : "beige-locations__grid--multi"
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
                  <BeigeReveal variant="zoom" delayMs={(index % 3) * 100}>
                    <Link href={href} className="beige-location-card group">
                      <div className="beige-location-card__media">
                        {imageSrc ? (
                          <BeigeCoverImage
                            src={imageSrc}
                            alt={alt}
                            className="beige-img-zoom absolute inset-0 h-full w-full object-cover"
                            placeholderClassName="beige-hero-frame__placeholder"
                            placeholder=""
                          />
                        ) : (
                          <div className="beige-hero-frame__placeholder" />
                        )}
                      </div>
                      <div className="beige-location-card__overlay" aria-hidden />
                      <div className="beige-location-card__body">
                        <h3 className="beige-location-card__name">
                          {location.name}
                        </h3>
                        {description ? (
                          <p className="beige-location-card__excerpt line-clamp-2">
                            {description}
                          </p>
                        ) : null}
                        <span className="beige-location-cta">
                          {dict.locations.cta}
                          <BeigeIconArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </BeigeReveal>
                </li>
              );
            })}
        </ul>
      </div>
    </section>
  );
}


export function BeigeAbout({
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
    <section id="about" className="beige-about">
      <div className="beige-shell">
        <div className="beige-about__grid">
          <BeigeReveal variant="left">
            <div className="beige-about__copy">
              <p className="beige-eyebrow">{dict.about.kicker}</p>
              <h2 className="beige-section__title">{dict.about.title}</h2>
              <p className="beige-lead">{dict.about.description}</p>
              <ul className="beige-about__benefits">
                <li>{dict.about.benefit1}</li>
                <li>{dict.about.benefit2}</li>
                <li>{dict.about.benefit3}</li>
              </ul>
              {about.cta ? (
                <Link href={ctaHref} className="beige-btn beige-about__cta">
                  {dict.about.cta}
                </Link>
              ) : null}
            </div>
          </BeigeReveal>
          <BeigeReveal variant="right">
            <div className="beige-about__media">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={dict.about.title}
                  className="beige-about__image"
                  loading="lazy"
                />
              ) : (
                <div className="beige-about__placeholder" aria-hidden="true" />
              )}
            </div>
          </BeigeReveal>
        </div>
      </div>
    </section>
  );
}

export function BeigeProcess({ dict }: Pick<Shared, "dict">) {
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
    <section id="process" className="beige-process">
      <div className="beige-shell">
        <BeigeReveal variant="up" className="beige-process__head">
          <div className="beige-section__head--center">
            <p className="beige-eyebrow beige-eyebrow--on-dark">
              {dict.process.kicker}
            </p>
            <h2 className="beige-section__title beige-section__title--on-dark">
              {dict.process.title}
            </h2>
            <p className="beige-lead beige-lead--on-dark">
              {dict.process.subtitle}
            </p>
            <hr className="beige-rule" />
          </div>
        </BeigeReveal>
        <ol className="beige-process__steps">
          {steps.map((step, index) => (
            <li key={step.number} className="beige-process__step">
              <BeigeReveal
                variant="up"
                delayMs={index * 100}
                className="beige-process__reveal"
              >
                <div className="beige-process-card">
                  <p className="beige-process-card__mark">{step.number}</p>
                  <h3 className="beige-process-card__title">{step.title}</h3>
                  <p className="beige-process-card__copy">{step.description}</p>
                </div>
              </BeigeReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ChannelIcon({ name }: { name: PublicContactChannel["icon"] }) {
  if (name === "whatsapp") return <BeigeIconWhatsApp className="h-5 w-5" />;
  if (name === "phone") return <BeigeIconPhone className="h-5 w-5" />;
  if (name === "email") return <BeigeIconMail className="h-5 w-5" />;
  if (name === "schedule") return <BeigeIconCalendar className="h-5 w-5" />;
  return <BeigeIconMapPin className="h-5 w-5" />;
}

export function BeigeContact({
  content,
  dict,
  description,
}: Pick<Shared, "content" | "dict"> & { description: string }) {
  const { contact, social } = content;
  const whatsappHref = beigeContactChannels(content).whatsappHref;
  const channels = collectPublicContactChannels(content, dict);
  const title = content.finalCta.title || dict.finalCta.title;

  return (
    <section
      id="contact"
      className="beige-contact"
      aria-labelledby="beige-contact-title"
    >
      <div className="beige-shell">
        <div className="beige-contact__panel">
          <BeigeReveal variant="up" className="beige-contact__header">
            <p className="beige-eyebrow beige-eyebrow--on-dark">
              {dict.contact.kicker}
            </p>
            <h2
              id="beige-contact-title"
              className="beige-section__title beige-section__title--on-dark"
            >
              {dict.contact.heading}
            </h2>
            <p className="beige-lead beige-lead--on-dark">
              {dict.contact.description}
            </p>
          </BeigeReveal>
          <div className="beige-contact__grid">
            <BeigeReveal variant="left">
              {channels.length > 0 ? (
                <ul className="beige-channels">
                  {channels.map((channel) => {
                    const body = (
                      <>
                        <span className="beige-channel__icon" aria-hidden>
                          <ChannelIcon name={channel.icon} />
                        </span>
                        <span className="beige-channel__copy">
                          <span className="beige-channel__eyebrow">
                            {channel.eyebrow}
                          </span>
                          <span className="beige-channel__value">{channel.value}</span>
                        </span>
                      </>
                    );
                    return (
                      <li key={channel.key}>
                        {channel.href ? (
                          <a
                            href={channel.href}
                            className="beige-channel"
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
                          <p className="beige-channel beige-channel--static">{body}</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="beige-lead beige-lead--on-dark">
                  {dict.contact.emptyChannels}
                </p>
              )}

              <div className="beige-contact__social">
                <BeigeSocialLinks
                  social={social}
                  dict={dict}
                  heading={dict.footer.follow}
                />
              </div>
              {contact.attentionNote ? (
                <p className="beige-contact__note">{contact.attentionNote}</p>
              ) : null}
            </BeigeReveal>

            <BeigeReveal variant="right" delayMs={80}>
              <div className="beige-contact__cta">
                <h3 className="beige-section__title">{title}</h3>
                <p className="beige-lead">{description}</p>
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    className="beige-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
                  >
                    <BeigeIconWhatsApp className="h-5 w-5" aria-hidden />
                    {dict.whatsapp.label}
                  </a>
                ) : null}
              </div>
            </BeigeReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
