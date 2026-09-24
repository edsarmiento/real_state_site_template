import Link from "next/link";
import { catalogSearchParams } from "@/lib/catalog-pagination";
import type { CatalogOfferFilter, PublicListingCard } from "@/lib/listing-types";
import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  pickLocalized,
  type PublicLocation,
} from "@/lib/public-site-content";
import { isExampleEmail, isExamplePhone } from "@/lib/example-contact";
import {
  fillTemplate,
  localizeSiteHref,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { darkContactChannels } from "@/themes/dark/dark-contact-channels";
import { DarkCoverImage } from "@/themes/dark/dark-cover-image";
import {
  DarkIconArrowRight,
  DarkIconArrowUpRight,
  DarkIconCalendar,
  DarkIconComments,
  DarkIconCompass,
  DarkIconLayers,
  DarkIconMail,
  DarkIconMapPin,
  DarkIconPhone,
  DarkIconWhatsApp,
} from "@/themes/dark/dark-icons";
import {
  darkCityKey,
  representativeDarkCityPhoto,
} from "@/themes/dark/dark-locations";
import { DarkReveal } from "@/themes/dark/dark-reveal";
import { DarkSocialLinks } from "@/themes/dark/dark-social-links";
import { getDarkCopy } from "@/themes/dark/dark-copy";
import { DARK_CATALOG_HASH } from "@/themes/dark/dark-ui";

type Shared = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

/**
 * Locations from SiteConfig (editorial) or structured listing.city.
 * Cards stay visible without scroll/hover animation.
 */
export function DarkLocations({
  locations,
  listings,
  selectedCity = "",
  oferta,
  propertyType,
  bedrooms,
  locale,
  defaultLocale,
  dict,
}: {
  locations: PublicLocation[];
  listings: PublicListingCard[];
  selectedCity?: string;
  oferta: CatalogOfferFilter;
  propertyType: string;
  bedrooms: string;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
}) {
  const selectedKey = darkCityKey(selectedCity);
  const items = locations
    .map((location) => {
      const city = location.filter.city?.trim();
      if (!city) return null;
      const href =
        localizedHref(
          "/",
          locale,
          catalogSearchParams({
            oferta,
            city,
            propertyType,
            bedrooms,
          }),
          defaultLocale,
        ) + DARK_CATALOG_HASH;
      const configured = location.imageUrl?.trim() || null;
      const listingPhoto = configured
        ? null
        : representativeDarkCityPhoto(city, listings);
      return {
        location,
        city,
        href,
        selected: Boolean(selectedKey) && darkCityKey(city) === selectedKey,
        imageSrc: configured || listingPhoto,
        fromListing: Boolean(!configured && listingPhoto),
      };
    })
    .filter(
      (
        item,
      ): item is {
        location: PublicLocation;
        city: string;
        href: string;
        selected: boolean;
        imageSrc: string | null;
        fromListing: boolean;
      } => Boolean(item),
    );

  if (items.length === 0) return null;

  const isSingle = items.length === 1;
  const countClass =
    items.length === 1
      ? "dark-locations__grid--single"
      : items.length === 2
        ? "dark-locations__grid--two"
        : "dark-locations__grid--multi";

  return (
    <section
      id="ubicaciones"
      className={
        isSingle
          ? "dark-locations dark-locations--single"
          : "dark-locations"
      }
      aria-labelledby="dark-locations-title"
    >
      <div
        className={
          isSingle ? "dark-shell dark-locations__split" : "dark-shell"
        }
      >
        <div
          className={
            isSingle
              ? "dark-locations__copy"
              : "dark-section__head dark-section__head--center"
          }
        >
          <p className="dark-eyebrow">{dict.locations.eyebrow}</p>
          <h2 id="dark-locations-title" className="dark-section__title">
            {dict.locations.title}
          </h2>
          <p className="dark-lead">{dict.locations.description}</p>
        </div>
        <ul className={`dark-locations__grid ${countClass}`}>
          {items.map(({ location, href, selected, imageSrc, fromListing }) => {
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
            const cardClass = [
              "dark-location-card",
              imageSrc ? null : "dark-location-card--fallback",
              selected ? "is-active" : null,
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <li key={location.id} className="dark-locations__item">
                <Link
                  href={href}
                  className={cardClass}
                  scroll={false}
                  aria-current={selected ? "true" : undefined}
                  data-active={selected ? "true" : undefined}
                >
                  <div
                    className="dark-location-card__media"
                    aria-hidden={!imageSrc}
                  >
                    {imageSrc ? (
                      <DarkCoverImage
                        src={imageSrc}
                        alt={alt}
                        className="dark-location-card__photo"
                        placeholderClassName="dark-location-card__placeholder dark-location-card__placeholder--with-icon"
                        placeholder={
                          <DarkIconMapPin className="dark-location-card__fallback-icon" />
                        }
                      />
                    ) : (
                      <div className="dark-location-card__placeholder dark-location-card__placeholder--with-icon">
                        <DarkIconMapPin className="dark-location-card__fallback-icon" />
                      </div>
                    )}
                  </div>
                  <div className="dark-location-card__overlay" aria-hidden />
                  <div className="dark-location-card__body">
                    <h3 className="dark-location-card__name">
                      {location.name}
                    </h3>
                    {description ? (
                      <p className="dark-location-card__excerpt">
                        {description}
                      </p>
                    ) : null}
                    <span className="dark-location-cta">
                      {dict.locations.cta}
                    </span>
                  </div>
                  <span className="dark-location-card__arrow" aria-hidden>
                    <DarkIconArrowUpRight className="h-5 w-5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/**
 * About is required by DiseñoBase1; HTML only has `#nosotros` in nav.
 * Skin is Dark glass/editorial, not Yellow.
 */
export function DarkAbout({
  content,
  dict,
  locale,
  defaultLocale,
  heroImage,
}: Shared & { heroImage?: string | null }) {
  const { about } = content;
  const ctaHref = about.cta
    ? localizeSiteHref(about.cta.href, locale, defaultLocale)
    : localizedHref("/#propiedades", locale, null, defaultLocale);

  return (
    <section id="nosotros" className="dark-about">
      <div className="dark-shell">
        <div className="dark-about__grid">
          <DarkReveal variant="left">
            <div className="dark-about__copy">
              <p className="dark-eyebrow">{dict.about.kicker}</p>
              <h2 className="dark-section__title">{dict.about.title}</h2>
              <p className="dark-lead">{dict.about.description}</p>
              <ul className="dark-about__benefits">
                <li>{dict.about.benefit1}</li>
                <li>{dict.about.benefit2}</li>
                <li>{dict.about.benefit3}</li>
              </ul>
              {about.cta ? (
                <Link href={ctaHref} className="dark-btn dark-btn--ghost">
                  {dict.about.cta}
                </Link>
              ) : null}
            </div>
          </DarkReveal>
          <DarkReveal variant="right" delayMs={150}>
            <div className="dark-about__panel" aria-hidden={!heroImage}>
              {heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImage}
                  alt=""
                  className="dark-about__image"
                  loading="lazy"
                />
              ) : (
                <div className="dark-about__placeholder" />
              )}
            </div>
          </DarkReveal>
        </div>
      </div>
    </section>
  );
}

const PROCESS_ICONS = [DarkIconCompass, DarkIconLayers, DarkIconComments] as const;

export function DarkProcess({ dict }: Pick<Shared, "dict">) {
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
    <section id="como-trabajamos" className="dark-process">
      <div className="dark-shell">
        <DarkReveal variant="up" className="dark-process__head">
          <div className="dark-section__head dark-section__head--center">
            <p className="dark-eyebrow">{dict.process.kicker}</p>
            <h2 className="dark-section__title">{dict.process.title}</h2>
            <p className="dark-lead">{dict.process.subtitle}</p>
          </div>
        </DarkReveal>
        <ol className="dark-process__steps">
          {steps.map((step, index) => {
            const Icon = PROCESS_ICONS[index] ?? DarkIconCompass;
            return (
              <li key={step.number}>
                <DarkReveal
                  variant="up"
                  delayMs={[0, 150, 300][index] ?? 0}
                >
                  <div className="dark-process-card">
                    <p className="dark-process-card__mark" aria-hidden>
                      {step.number}
                    </p>
                    <span className="dark-process-card__icon">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="dark-process-card__title">{step.title}</h3>
                    <p className="dark-process-card__copy">{step.description}</p>
                  </div>
                </DarkReveal>
              </li>
            );
          })}
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
  const whatsappHref = darkContactChannels(content).whatsappHref;
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
  if (contact.phoneHref && contact.phone?.trim()) {
    const phone = contact.phone.trim();
    if (!isExamplePhone(phone)) {
      channels.push({
        key: "phone",
        eyebrow: dict.contact.callUs,
        value: phone,
        href: contact.phoneHref,
        icon: "phone",
      });
    }
  }
  if (contact.emailHref && contact.email?.trim()) {
    const email = contact.email.trim();
    if (!isExampleEmail(email)) {
      channels.push({
        key: "email",
        eyebrow: dict.contact.email,
        value: email,
        href: contact.emailHref,
        icon: "email",
      });
    }
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
  if (contact.location?.trim()) {
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
  if (name === "whatsapp") return <DarkIconWhatsApp className="h-5 w-5" />;
  if (name === "phone") return <DarkIconPhone className="h-5 w-5" />;
  if (name === "email") return <DarkIconMail className="h-5 w-5" />;
  if (name === "schedule") return <DarkIconCalendar className="h-5 w-5" />;
  return <DarkIconMapPin className="h-5 w-5" />;
}

export function DarkContact({
  content,
  dict,
  locale,
  defaultLocale,
}: Shared) {
  const { contact, social } = content;
  const copy = getDarkCopy(locale);
  const catalogHref = localizedHref(
    "/#propiedades",
    locale,
    null,
    defaultLocale,
  );
  const channels = collectChannels(content, dict);
  const hasChannels = channels.length > 0;
  const whatsappHref = darkContactChannels(content).whatsappHref;

  return (
    <section id="contacto" className="dark-contact" aria-labelledby="dark-contact-title">
      <div className="dark-shell">
        <div className="dark-contact__panel">
          <header className="dark-contact__header">
            <p className="dark-eyebrow">{dict.contact.kicker}</p>
            <h2 id="dark-contact-title" className="dark-section__title">
              {dict.contact.heading}
            </h2>
            <p className="dark-lead">{dict.contact.description}</p>
          </header>
          <div className="dark-contact__grid">
            <div className="dark-contact__copy">
              {channels.length > 0 ? (
                <ul className="dark-channels">
                  {channels.map((channel) => {
                    const body = (
                      <>
                        <span className="dark-channel__icon" aria-hidden>
                          <ChannelIcon name={channel.icon} />
                        </span>
                        <span className="dark-channel__copy">
                          <span className="dark-channel__eyebrow">
                            {channel.eyebrow}
                          </span>
                          <span className="dark-channel__value">
                            {channel.value}
                          </span>
                        </span>
                        {channel.href ? (
                          <DarkIconArrowRight className="dark-channel__arrow" />
                        ) : null}
                      </>
                    );
                    return (
                      <li key={channel.key}>
                        {channel.href ? (
                          <a
                            href={channel.href}
                            className="dark-channel"
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
                          <p className="dark-channel dark-channel--static">
                            {body}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              <div className="dark-contact__social">
                <DarkSocialLinks social={social} dict={dict} heading={dict.footer.follow} />
              </div>
              {!hasChannels ? (
                <div className="dark-contact__fallback">
                  <Link href={catalogHref} className="dark-btn">
                    {dict.contact.viewProperties}
                  </Link>
                </div>
              ) : null}
              {contact.attentionNote ? (
                <p className="dark-contact__note">{contact.attentionNote}</p>
              ) : null}
            </div>
            <aside className="dark-contact__cta">
              <h3 className="dark-section__title">
                {content.finalCta.title || dict.finalCta.title}
              </h3>
              <p className="dark-lead">{copy.contactDescription}</p>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  className="dark-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
                >
                  <DarkIconWhatsApp className="h-4 w-4" />
                  {dict.whatsapp.label}
                </a>
              ) : null}
              {content.contact.scheduleCallUrl ? (
                <a
                  href={content.contact.scheduleCallUrl}
                  aria-label={`${dict.contact.scheduleCall}. ${dict.a11y.opensInNewTab}`}
                  className="dark-btn dark-btn--ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dict.contact.scheduleCall}
                </a>
              ) : null}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
