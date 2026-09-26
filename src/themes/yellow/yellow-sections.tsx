import {
  collectPublicContactChannels,
  publicContactChannels,
  type PublicContactChannel,
} from "@/lib/public-contact-channels";
import Link from "next/link";
import type { PublicListingCard } from "@/lib/listing-types";
import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  pickLocalized,
  type PublicLocation,
} from "@/lib/public-site-content";
import {
  fillTemplate,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { YellowCoverImage } from "@/themes/yellow/yellow-cover-image";
import {
  YellowIconArrowRight,
  YellowIconCheck,
  YellowIconCalendar,
  YellowIconMapPin,
  YellowIconHome,
  YellowIconMail,
  YellowIconPhone,
  YellowIconWhatsApp,
} from "@/themes/yellow/yellow-icons";
import {
  yellowEditorialIndex,
  yellowLocationCatalogHref,
  yellowLocationGridClass,
  yellowLocationSlot,
  yellowRepresentativeListingPhoto,
} from "@/themes/yellow/yellow-locations";
import { YellowReveal } from "@/themes/yellow/yellow-reveal";
import { YellowSocialLinks } from "@/themes/yellow/yellow-social-links";

type Shared = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function YellowLocations({
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
      const href = yellowLocationCatalogHref(city, locale, defaultLocale);
      const configured = location.imageUrl?.trim() || null;
      const listingPhoto = configured
        ? null
        : yellowRepresentativeListingPhoto(location.filter.city, listings);
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

  return (
    <section className="yellow-locations" aria-labelledby="yellow-locations-title">
      <div className="yellow-shell">
        <YellowReveal variant="up">
          <div className="yellow-section__head">
            <p className="yellow-eyebrow">{dict.locations.eyebrow}</p>
            <h2 id="yellow-locations-title" className="yellow-section__title">
              {dict.locations.title}
            </h2>
            <p className="yellow-lead">{dict.locations.description}</p>
          </div>
        </YellowReveal>
        <ul className={yellowLocationGridClass(items.length)}>
          {items.map(({ location, href, imageSrc, fromListing }, index) => {
            const description = pickLocalized(location.shortDescription, locale);
            const alt = fromListing
              ? fillTemplate(dict.locations.representativeAlt, {
                  name: location.name,
                })
              : pickLocalized(location.imageAlt, locale) ||
                fillTemplate(dict.locations.fallbackAlt, {
                  name: location.name,
                });
            const slot = yellowLocationSlot(index, items.length);

            return (
              <li
                key={location.id}
                className={`yellow-location-item yellow-location-item--${slot}`}
              >
                <YellowReveal variant="zoom" delayMs={Math.min(index, 3) * 80}>
                  <Link href={href} className="yellow-location-card group">
                    <div className="yellow-location-card__media">
                      {imageSrc ? (
                        <YellowCoverImage
                          src={imageSrc}
                          alt={alt}
                          className="yellow-img-zoom absolute inset-0 h-full w-full object-cover"
                          placeholderClassName="yellow-hero-frame__placeholder"
                          placeholder=""
                          decorative
                        />
                      ) : (
                        <div className="yellow-hero-frame__placeholder" />
                      )}
                    </div>
                    <div className="yellow-location-card__overlay" aria-hidden />
                    <div className="yellow-location-card__body">
                      <span className="yellow-location-card__index">
                        {yellowEditorialIndex(index)}
                      </span>
                      {description ? (
                        <span className="yellow-location-card__kicker">
                          {description}
                        </span>
                      ) : null}
                      <h3 className="yellow-location-card__name">
                        {location.name}
                      </h3>
                      <span className="yellow-location-card__line" aria-hidden />
                      <span className="yellow-location-cta">
                        {dict.locations.cta}
                        <span className="yellow-location-card__go" aria-hidden>
                          <YellowIconArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </span>
                    </div>
                  </Link>
                </YellowReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function YellowAbout({
  imageUrl,
  dict,
}: Pick<Shared, "dict"> & { imageUrl?: string }) {
  const benefits = [
    dict.about.benefit1,
    dict.about.benefit2,
    dict.about.benefit3,
  ].filter(Boolean);

  return (
    <section id="sobre-nosotros" className="yellow-about">
      <div className="yellow-shell yellow-about__grid">
        <YellowReveal variant="left">
          <div className="yellow-about__copy">
            <p className="yellow-eyebrow">{dict.about.kicker}</p>
            <h2 className="yellow-section__title">{dict.about.title}</h2>
            <p className="yellow-lead">{dict.about.description}</p>
            {benefits.length > 0 ? (
              <ul className="yellow-about__benefits">
                {benefits.map((benefit) => (
                  <li key={benefit}>
                    <span className="yellow-about__check" aria-hidden>
                      <YellowIconCheck className="h-3 w-3" />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </YellowReveal>
        <YellowReveal variant="right">
          <div className="yellow-about__media">
            <YellowCoverImage
              src={imageUrl}
              alt=""
              className="yellow-about__image"
              placeholderClassName="yellow-about__icon"
              placeholder={<YellowIconHome className="h-10 w-10" />}
              decorative
            />
          </div>
        </YellowReveal>
      </div>
    </section>
  );
}

export function YellowProcess({ dict }: Pick<Shared, "dict">) {
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
    <section id="como-trabajamos" className="yellow-process">
      <div className="yellow-shell">
        <YellowReveal variant="up" className="yellow-process__head">
          <p className="yellow-eyebrow">{dict.process.kicker}</p>
          <h2 className="yellow-section__title">{dict.process.title}</h2>
          <p className="yellow-lead">{dict.process.subtitle}</p>
        </YellowReveal>
        <ol className="yellow-process__steps">
          {steps.map((step, index) => (
            <li key={step.number}>
              <YellowReveal variant="up" delayMs={index * 80}>
                <div className="yellow-process-card">
                  <p className="yellow-process-card__mark">{step.number}</p>
                  <h3 className="yellow-process-card__title">{step.title}</h3>
                  <p className="yellow-process-card__copy">{step.description}</p>
                </div>
              </YellowReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ChannelIcon({ name }: { name: PublicContactChannel["icon"] }) {
  if (name === "whatsapp") return <YellowIconWhatsApp className="h-5 w-5" />;
  if (name === "phone") return <YellowIconPhone className="h-5 w-5" />;
  if (name === "email") return <YellowIconMail className="h-5 w-5" />;
  if (name === "schedule") return <YellowIconCalendar className="h-5 w-5" />;
  return <YellowIconMapPin className="h-5 w-5" />;
}

export function YellowContact({
  content,
  dict,
  description,
}: Pick<Shared, "content" | "dict"> & { description: string }) {
  const { social } = content;
  const channels = collectPublicContactChannels(content, dict);
  const whatsapp = publicContactChannels(content).whatsappHref;

  return (
    <section id="contacto" className="yellow-contact" aria-labelledby="yellow-contact-title">
      <div className="yellow-shell yellow-contact__panel">
        <div className="yellow-contact__header">
          <p className="yellow-eyebrow">{dict.contact.kicker}</p>
          <h2 id="yellow-contact-title" className="yellow-section__title">{dict.contact.heading}</h2>
          <p className="yellow-lead">{dict.contact.description}</p>
        </div>
        <div className="yellow-contact__grid">
          <div>
            {channels.length > 0 ? (
              <ul className="yellow-channels">
                {channels.map((channel) => {
                  const body = (
                    <>
                      <span className="yellow-channel__icon" aria-hidden>
                        <ChannelIcon name={channel.icon} />
                      </span>
                      <span className="yellow-channel__copy">
                        <span className="yellow-channel__eyebrow">{channel.eyebrow}</span>
                        <span className="yellow-channel__value">{channel.value}</span>
                      </span>
                      {channel.href ? <YellowIconArrowRight className="yellow-channel__arrow" /> : null}
                    </>
                  );
                  return (
                    <li key={channel.key}>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          className="yellow-channel"
                          aria-label={channel.external
                            ? `${channel.eyebrow}: ${channel.value}. ${dict.a11y.opensInNewTab}`
                            : `${channel.eyebrow}: ${channel.value}`}
                          {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {body}
                        </a>
                      ) : (
                        <p className="yellow-channel yellow-channel--static">{body}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : <p className="yellow-lead">{dict.contact.emptyChannels}</p>}
            <div className="yellow-contact__social">
              <YellowSocialLinks social={social} dict={dict} heading={dict.a11y.followUs} />
            </div>
            {content.contact.attentionNote ? (
              <p className="yellow-contact__note">{content.contact.attentionNote}</p>
            ) : null}
          </div>
          <div className="yellow-contact__cta">
            <h3 className="yellow-about__cta-title">
              {content.finalCta.title || dict.finalCta.title}
            </h3>
            <p className="yellow-lead">{description}</p>
            {whatsapp ? (
              <a
                href={whatsapp}
                className="yellow-btn yellow-btn--whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
              >
                <YellowIconWhatsApp className="h-4 w-4" />
                {dict.whatsapp.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
