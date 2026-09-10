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
import { yellowContactChannels } from "@/themes/yellow/yellow-contact-channels";
import { YellowContactForm } from "@/themes/yellow/yellow-contact-form";
import { YellowCoverImage } from "@/themes/yellow/yellow-cover-image";
import {
  YellowIconArrowRight,
  YellowIconCheck,
  YellowIconHome,
  YellowIconMail,
  YellowIconPhone,
  YellowIconWhatsApp,
} from "@/themes/yellow/yellow-icons";
import {
  yellowCityListingCount,
  yellowEditorialIndex,
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
      const href = localizedHref("/", locale, { city }, defaultLocale);
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
            const listingCount = yellowCityListingCount(
              location.filter.city ?? location.name,
              listings,
            );
            let countLabel: string | null = null;
            if (listingCount === 1) countLabel = dict.results.one;
            else if (listingCount > 1) {
              countLabel = fillTemplate(dict.results.many, {
                count: listingCount,
              });
            }

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
                      {countLabel ? (
                        <p className="yellow-location-card__count">
                          {countLabel}
                        </p>
                      ) : null}
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
  content,
  dict,
  locale,
  defaultLocale,
}: Shared) {
  const whatsapp = yellowContactChannels(content).whatsappHref;
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
          <div className="yellow-about__cta">
            {content.about.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.about.imageUrl}
                alt=""
                className="yellow-about__image"
                loading="lazy"
              />
            ) : (
              <span className="yellow-about__icon" aria-hidden>
                <YellowIconHome className="h-10 w-10" />
              </span>
            )}
            <h3 className="yellow-about__cta-title">{dict.finalCta.title}</h3>
            <p className="yellow-lead">
              {fillTemplate(dict.finalCta.description, {
                name: content.brand.name,
              })}
            </p>
            {whatsapp ? (
              <a
                href={whatsapp}
                className="yellow-btn yellow-btn--whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${dict.about.cta}. ${dict.a11y.opensInNewTab}`}
              >
                <YellowIconWhatsApp className="h-4 w-4" />
                {dict.about.cta}
              </a>
            ) : (
              <Link
                href={localizedHref("/#contacto", locale, null, defaultLocale)}
                className="yellow-btn yellow-btn--whatsapp"
              >
                {dict.about.cta}
              </Link>
            )}
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

type Channel = {
  key: string;
  eyebrow: string;
  value: string;
  href: string | null;
  external?: boolean;
  icon: "whatsapp" | "phone" | "email";
};

function collectChannels(
  content: PublicSiteContent,
  dict: SiteDictionary,
): Channel[] {
  const contact = content.contact;
  const whatsappHref = yellowContactChannels(content).whatsappHref;
  const channels: Channel[] = [];
  if (whatsappHref) {
    channels.push({
      key: "whatsapp",
      eyebrow: dict.contact.writeUs,
      value: dict.whatsapp.label,
      href: whatsappHref,
      external: true,
      icon: "whatsapp",
    });
  }
  if (contact.phoneHref) {
    channels.push({
      key: "phone",
      eyebrow: dict.contact.callUs,
      value: contact.phone || dict.contact.callUs,
      href: contact.phoneHref,
      icon: "phone",
    });
  }
  if (contact.emailHref && contact.email) {
    channels.push({
      key: "email",
      eyebrow: dict.contact.email,
      value: contact.email,
      href: contact.emailHref,
      icon: "email",
    });
  }
  return channels;
}

function ChannelIcon({ name }: { name: Channel["icon"] }) {
  if (name === "whatsapp") return <YellowIconWhatsApp className="h-5 w-5" />;
  if (name === "phone") return <YellowIconPhone className="h-5 w-5" />;
  return <YellowIconMail className="h-5 w-5" />;
}

export function YellowContact({
  content,
  dict,
  locale,
  defaultLocale,
}: Shared) {
  const { contact, legal, social } = content;
  const catalogHref = localizeSiteHref("#propiedades", locale, defaultLocale);
  const channels = collectChannels(content, dict);
  const hasChannels = channels.length > 0;

  return (
    <section id="contacto" className="yellow-contact">
      <div className="yellow-shell yellow-contact__grid">
        <div className="yellow-contact__copy">
          <p className="yellow-eyebrow">{dict.contact.kicker}</p>
          <h2 className="yellow-section__title">{dict.contact.heading}</h2>
          <p className="yellow-lead">{dict.contact.description}</p>
          <YellowReveal variant="up">
            {channels.length > 0 ? (
              <ul className="yellow-channels">
                {channels.map((channel) => {
                  const body = (
                    <>
                      <span className="yellow-channel__icon" aria-hidden>
                        <ChannelIcon name={channel.icon} />
                      </span>
                      <span className="yellow-channel__copy">
                        <span className="yellow-channel__eyebrow">
                          {channel.eyebrow}
                        </span>
                        <span className="yellow-channel__value">
                          {channel.value}
                        </span>
                      </span>
                      <YellowIconArrowRight className="yellow-channel__arrow" />
                    </>
                  );
                  return (
                    <li key={channel.key}>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          className="yellow-channel"
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
                        <p className="yellow-channel yellow-channel--static">
                          {body}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <div className="yellow-contact__social">
              <YellowSocialLinks
                social={social}
                dict={dict}
                heading={dict.a11y.followUs}
              />
            </div>
            {!hasChannels ? (
              <Link href={catalogHref} className="yellow-btn">
                {dict.contact.viewProperties}
              </Link>
            ) : null}
            {contact.attentionNote ? (
              <p className="yellow-contact__note">{contact.attentionNote}</p>
            ) : null}
          </YellowReveal>
        </div>
        <YellowReveal variant="up" delayMs={80}>
          <YellowContactForm
            contact={contact}
            legal={legal}
            dict={dict}
            locale={locale}
            defaultLocale={defaultLocale}
          />
        </YellowReveal>
      </div>
    </section>
  );
}
