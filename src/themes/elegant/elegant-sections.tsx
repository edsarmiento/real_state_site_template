import Link from "next/link";
import type { PublicListingCard } from "@/lib/listing-types";
import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  pickLocalized,
  type PublicLocation,
} from "@/lib/public-site-content";
import { isExampleEmail } from "@/lib/example-contact";
import {
  fillTemplate,
  localizeSiteHref,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { elegantContactChannels } from "@/themes/elegant/elegant-contact-channels";
import { ElegantCoverImage } from "@/themes/elegant/elegant-cover-image";
import {
  ElegantIconCalendar,
  ElegantIconMail,
  ElegantIconMapPin,
  ElegantIconPhone,
  ElegantIconWhatsApp,
} from "@/themes/elegant/elegant-icons";
import {
  elegantLocationsGridClass,
  representativeListingPhoto,
} from "@/themes/elegant/elegant-location-photo";
import { ElegantReveal } from "@/themes/elegant/elegant-reveal";
import { ElegantSocialLinks } from "@/themes/elegant/elegant-social-links";
import { getElegantCopy } from "@/themes/elegant/elegant-copy";
import { keepTrailingWordsTogether } from "@/themes/elegant/elegant-title-wrap";

type Shared = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function ElegantLocations({
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
  const copy = getElegantCopy(locale);
  const items = locations
    .map((location) => {
      const city = location.filter.city?.trim();
      if (!city) return null;
      const href =
        localizedHref("/", locale, { city }, defaultLocale) + "#propiedades";
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

  return (
    <section id="destinos" className="elegant-locations">
      <div className="elegant-shell">
        <ElegantReveal>
          <div className="elegant-section__head">
            <p className="elegant-kicker">{dict.locations.eyebrow}</p>
            <h2 className="elegant-section__title">{dict.locations.title}</h2>
            <p className="elegant-muted">{dict.locations.description}</p>
          </div>
        </ElegantReveal>
        <ElegantReveal>
          <ul className={elegantLocationsGridClass(items.length)}>
            {items.map(({ location, href, imageSrc, fromListing }) => {
              const description = pickLocalized(location.shortDescription, locale);
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
                  <Link href={href} className="elegant-location-card">
                    <ElegantCoverImage
                      src={imageSrc}
                      alt={alt}
                      className="elegant-location-card__image"
                      placeholderClassName="elegant-location-card__placeholder"
                    />
                    <span className="elegant-location-card__overlay" aria-hidden />
                    <span className="elegant-location-card__body">
                      {description ? (
                        <span className="elegant-kicker">{description}</span>
                      ) : null}
                      <span className="elegant-location-card__name">
                        {location.name}
                      </span>
                      <span className="elegant-location-card__cta">
                        {copy.locationsExplore} →
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </ElegantReveal>
      </div>
    </section>
  );
}

export function ElegantAbout({
  imageUrl,
  content,
  dict,
  locale,
  defaultLocale,
}: Shared & { imageUrl?: string }) {
  const { about } = content;
  const ctaHref = about.cta
    ? localizeSiteHref(about.cta.href, locale, defaultLocale)
    : localizedHref("/#propiedades", locale, null, defaultLocale);

  return (
    <section id="sobre-nosotros" className="elegant-about">
      <div className="elegant-shell">
        <div className="elegant-section__head">
          <p className="elegant-kicker elegant-kicker--on-gold">{dict.about.kicker}</p>
          <h2 className="elegant-section__title elegant-section__title--on-gold">
            {dict.about.title}
          </h2>
          <p className="elegant-about__lead">{dict.about.description}</p>
        </div>
        <div className="elegant-about__grid">
          <div>
            <ul className="elegant-about__benefits">
              <li>{dict.about.benefit1}</li>
              <li>{dict.about.benefit2}</li>
              <li>{dict.about.benefit3}</li>
            </ul>
            <Link href={ctaHref} className="elegant-btn elegant-btn--gold">
              {dict.about.cta}
            </Link>
          </div>
          <div className="elegant-about__media" aria-hidden>
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                className="elegant-about__image"
                loading="lazy"
              />
            ) : (
              <div className="elegant-about__placeholder" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ElegantProcess({ dict }: Pick<Shared, "dict">) {
  const steps = [
    { number: "01", title: dict.process.step1Title, description: dict.process.step1Description },
    { number: "02", title: dict.process.step2Title, description: dict.process.step2Description },
    { number: "03", title: dict.process.step3Title, description: dict.process.step3Description },
  ];

  return (
    <section id="como-trabajamos" className="elegant-process">
      <div className="elegant-shell">
        <div className="elegant-section__head">
          <p className="elegant-kicker">{dict.process.kicker}</p>
          <h2 className="elegant-section__title">
            {keepTrailingWordsTogether(dict.process.title, 3)}
          </h2>
          <p className="elegant-muted">{dict.process.subtitle}</p>
        </div>
        <ol className="elegant-process__grid">
          {steps.map((step) => (
            <li key={step.number} className="elegant-process-card">
              <span className="elegant-process-card__mark" aria-hidden>
                {step.number}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
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
  icon: "whatsapp" | "phone" | "email" | "schedule" | "location";
};

function collectChannels(
  content: PublicSiteContent,
  dict: SiteDictionary,
): Channel[] {
  const contact = content.contact;
  const { whatsappHref, phone, phoneHref } = elegantContactChannels(content);
  const channels: Channel[] = [];
  if (phoneHref) {
    channels.push({
      key: "phone",
      eyebrow: dict.contact.callUs,
      value: phone || dict.contact.callUs,
      href: phoneHref,
      icon: "phone",
    });
  }
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
  if (contact.emailHref && contact.email && !isExampleEmail(contact.email)) {
    channels.push({
      key: "email",
      eyebrow: dict.contact.email,
      value: contact.email,
      href: contact.emailHref,
      icon: "email",
    });
  }
  if (contact.scheduleCallUrl) {
    channels.push({
      key: "schedule",
      eyebrow: dict.contact.schedule,
      value: dict.contact.scheduleValue,
      href: contact.scheduleCallUrl,
      external: true,
      icon: "schedule",
    });
  }
  if (contact.location) {
    channels.push({
      key: "location",
      eyebrow: dict.contact.location,
      value: contact.location,
      href: null,
      icon: "location",
    });
  }
  return channels;
}

function ChannelIcon({ name }: { name: Channel["icon"] }) {
  if (name === "whatsapp") return <ElegantIconWhatsApp className="h-5 w-5" />;
  if (name === "phone") return <ElegantIconPhone className="h-5 w-5" />;
  if (name === "email") return <ElegantIconMail className="h-5 w-5" />;
  if (name === "schedule") return <ElegantIconCalendar className="h-5 w-5" />;
  return <ElegantIconMapPin className="h-5 w-5" />;
}

export function ElegantContact({
  content,
  dict,
  description,
}: Pick<Shared, "content" | "dict"> & { description: string }) {
  const { social } = content;
  const channels = collectChannels(content, dict);
  const whatsapp = elegantContactChannels(content).whatsappHref;

  return (
    <section id="contacto" className="elegant-contact" aria-labelledby="elegant-contact-title">
      <div className="elegant-shell elegant-contact__panel">
        <div className="elegant-contact__header">
          <p className="elegant-kicker">{dict.contact.kicker}</p>
          <h2 id="elegant-contact-title" className="elegant-section__title">{dict.contact.heading}</h2>
          <p className="elegant-muted">{dict.contact.description}</p>
        </div>
        <div className="elegant-contact__grid">
          <div>
            {channels.length ? (
              <ul className="elegant-channels">
                {channels.map((channel) => {
                  const body = (
                    <>
                      <span className="elegant-channel__icon" aria-hidden>
                        <ChannelIcon name={channel.icon} />
                      </span>
                      <span className="elegant-channel__copy">
                        <span className="elegant-channel__eyebrow">{channel.eyebrow}</span>
                        <span className="elegant-channel__value">{channel.value}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={channel.key}>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          className="elegant-channel"
                          aria-label={channel.external
                            ? `${channel.eyebrow}: ${channel.value}. ${dict.a11y.opensInNewTab}`
                            : `${channel.eyebrow}: ${channel.value}`}
                          {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {body}
                        </a>
                      ) : (
                        <p className="elegant-channel elegant-channel--static">{body}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : <p className="elegant-muted">{dict.contact.emptyChannels}</p>}
            <div className="elegant-contact__social">
              <ElegantSocialLinks
                social={social}
                dict={dict}
                heading={dict.footer.follow}
                accentHeading
              />
            </div>
          </div>
          <div className="elegant-contact__cta">
            <h3 className="elegant-section__title elegant-section__title--on-gold">
              {content.finalCta.title || dict.finalCta.title}
            </h3>
            <p>{description}</p>
            {whatsapp ? (
              <a href={whatsapp} className="elegant-btn elegant-btn--gold" target="_blank" rel="noopener noreferrer" aria-label={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}>
                <ElegantIconWhatsApp className="h-4 w-4" />
                {dict.whatsapp.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
