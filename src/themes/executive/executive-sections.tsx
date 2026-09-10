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
import { executiveContactChannels } from "@/themes/executive/executive-contact-channels";
import { ExecutiveCoverImage } from "@/themes/executive/executive-cover-image";
import type { ExecutiveCopy } from "@/themes/executive/executive-copy";
import {
  ExecutiveIconArrowRight,
  ExecutiveIconCalendar,
  ExecutiveIconCheck,
  ExecutiveIconHouseUser,
  ExecutiveIconMail,
  ExecutiveIconMapPin,
  ExecutiveIconPhone,
  ExecutiveIconWhatsApp,
} from "@/themes/executive/executive-icons";
import { representativeListingPhoto } from "@/themes/executive/executive-location-photo";
import { ExecutiveSocialLinks } from "@/themes/executive/executive-social-links";

type Shared = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  copy: ExecutiveCopy;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function ExecutiveLocations({
  locations,
  listings,
  locale,
  defaultLocale,
  dict,
  copy,
}: {
  locations: PublicLocation[];
  listings: PublicListingCard[];
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
  copy: ExecutiveCopy;
}) {
  const items = locations
    .map((location) => {
      const city = location.filter.city?.trim();
      if (!city) return null;
      const href = `${localizedHref("/", locale, { city }, defaultLocale)}#propiedades`;
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
    <section className="executive-locations" aria-labelledby="executive-locations-title">
      <div className="executive-shell">
        <div className="executive-section__head">
          <p className="executive-kicker">{dict.locations.eyebrow}</p>
          <h2 id="executive-locations-title" className="executive-section__title">
            {dict.locations.title}
          </h2>
          <p className="executive-lead">{dict.locations.description}</p>
        </div>
        <ul className="executive-locations__grid">
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
                <Link href={href} className="executive-location-card">
                  <div className="executive-location-card__media">
                    {imageSrc ? (
                      <ExecutiveCoverImage
                        src={imageSrc}
                        alt={alt}
                        className="executive-location-card__photo"
                        placeholderClassName="executive-location-card__placeholder"
                        placeholder=""
                      />
                    ) : (
                      <div className="executive-location-card__placeholder" aria-hidden />
                    )}
                    <div className="executive-location-card__scrim" aria-hidden />
                  </div>
                  <div className="executive-location-card__body">
                    {description ? (
                      <p className="executive-location-card__kicker">{description}</p>
                    ) : null}
                    <h3 className="executive-location-card__name">{location.name}</h3>
                    <span className="executive-location-cta" aria-hidden="true">
                      {copy.locationsExplore}
                      <ExecutiveIconArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function ExecutiveAbout({
  content,
  dict,
  copy,
  locale,
  defaultLocale,
}: Shared) {
  const { about } = content;
  const ctaHref = about.cta
    ? localizeSiteHref(about.cta.href, locale, defaultLocale)
    : localizedHref("/#propiedades", locale, null, defaultLocale);
  const whatsappHref = executiveContactChannels(content).whatsappHref;
  const benefits = [
    { title: dict.about.benefit1, copy: copy.benefit1Copy },
    { title: dict.about.benefit2, copy: copy.benefit2Copy },
    { title: dict.about.benefit3, copy: copy.benefit3Copy },
  ];

  return (
    <section id="sobre-nosotros" className="executive-about">
      <div className="executive-shell executive-about__grid">
        <div className="executive-about__copy">
          <p className="executive-kicker">{copy.aboutKicker}</p>
          <h2 className="executive-section__title">{dict.about.title}</h2>
          <p className="executive-lead">{dict.about.description}</p>
          <ul className="executive-about__benefits">
            {benefits.map((benefit) => (
              <li key={benefit.title}>
                <span className="executive-check" aria-hidden>
                  <ExecutiveIconCheck className="h-3 w-3" />
                </span>
                <span>
                  <strong>{benefit.title}</strong>
                  <span>{benefit.copy}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link href={ctaHref} className="executive-btn">
            {dict.about.cta}
          </Link>
        </div>

        <div className="executive-ready">
          <span className="executive-ready__icon" aria-hidden>
            <ExecutiveIconHouseUser className="h-10 w-10" />
          </span>
          <h3>{copy.aboutReadyTitle}</h3>
          <p>{copy.aboutReadyCopy}</p>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              className="executive-whatsapp-cta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${copy.aboutAdvisorCta}. ${dict.a11y.opensInNewTab}`}
            >
              <ExecutiveIconWhatsApp className="executive-whatsapp-cta__icon" />
              {copy.aboutAdvisorCta}
            </a>
          ) : (
            <Link href={ctaHref} className="executive-btn executive-btn--ghost">
              {dict.about.cta}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function ExecutiveProcess({ dict }: Pick<Shared, "dict">) {
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
    <section id="como-trabajamos" className="executive-process">
      <div className="executive-shell">
        <div className="executive-section__head executive-section__head--center">
          <p className="executive-kicker">{dict.process.kicker}</p>
          <h2 className="executive-section__title">{dict.process.title}</h2>
          <p className="executive-lead">{dict.process.subtitle}</p>
        </div>
        <ol className="executive-process__grid">
          {steps.map((step) => (
            <li key={step.number} className="executive-process-card">
              <span className="executive-process-card__mark">{step.number}</span>
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
  const whatsappHref = executiveContactChannels(content).whatsappHref;
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
  if (name === "whatsapp") return <ExecutiveIconWhatsApp className="h-5 w-5" />;
  if (name === "phone") return <ExecutiveIconPhone className="h-5 w-5" />;
  if (name === "email") return <ExecutiveIconMail className="h-5 w-5" />;
  if (name === "schedule") return <ExecutiveIconCalendar className="h-5 w-5" />;
  return <ExecutiveIconMapPin className="h-5 w-5" />;
}

export function ExecutiveContact({
  content,
  dict,
  copy,
  locale,
  defaultLocale,
}: Shared) {
  const { contact, social } = content;
  const catalogHref = localizedHref("/#propiedades", locale, null, defaultLocale);
  const channels = collectChannels(content, dict);
  const whatsappHref = executiveContactChannels(content).whatsappHref;

  return (
    <section id="contacto" className="executive-contact">
      <div className="executive-shell executive-contact__grid">
        <div className="executive-contact__copy">
          <p className="executive-kicker">{dict.contact.kicker}</p>
          <h2 className="executive-section__title">{dict.contact.heading}</h2>
          <p className="executive-lead">{dict.contact.description}</p>
          {channels.length > 0 ? (
            <ul className="executive-channels">
              {channels.map((channel) => {
                const body = (
                  <>
                    <span className="executive-channel__icon" aria-hidden>
                      <ChannelIcon name={channel.icon} />
                    </span>
                    <span className="executive-channel__copy">
                      <span className="executive-channel__eyebrow">
                        {channel.eyebrow}
                      </span>
                      <span className="executive-channel__value">{channel.value}</span>
                    </span>
                    <ExecutiveIconArrowRight className="executive-channel__arrow" />
                  </>
                );
                return (
                  <li key={channel.key}>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="executive-channel"
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
                      <p className="executive-channel executive-channel--static">{body}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <Link href={catalogHref} className="executive-btn">
              {dict.contact.viewProperties}
            </Link>
          )}
          <ExecutiveSocialLinks
            social={social}
            dict={dict}
            heading={dict.footer.follow}
          />
        </div>

        <aside className="executive-consult" aria-label={dict.contact.formEyebrow}>
          <p className="executive-kicker">{dict.contact.formEyebrow}</p>
          <h3>{dict.contact.formTitle}</h3>
          <p>{dict.contact.formUnavailable}</p>
          {whatsappHref ? (
            <div className="executive-consult__wa">
              <p>{copy.immediatePrompt}</p>
              <a
                href={whatsappHref}
                className="executive-whatsapp-cta executive-whatsapp-cta--block"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${copy.openWhatsApp}. ${dict.a11y.opensInNewTab}`}
              >
                <ExecutiveIconWhatsApp className="executive-whatsapp-cta__icon" />
                {copy.openWhatsApp}
              </a>
            </div>
          ) : contact.attentionNote ? (
            <p className="executive-consult__note">{contact.attentionNote}</p>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
