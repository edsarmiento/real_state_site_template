import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  localizeSiteHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { ultraContactChannels } from "@/themes/ultra/ultra-contact-channels";
import {
  UltraIconCalendar,
  UltraIconMail,
  UltraIconMapPin,
  UltraIconPhone,
  UltraIconWhatsApp,
} from "@/themes/ultra/ultra-icons";
import { UltraSocialLinks } from "@/themes/ultra/ultra-social-links";

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
  const whatsappHref = ultraContactChannels(content).whatsappHref;
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
  if (name === "whatsapp") return <UltraIconWhatsApp className="h-5 w-5" />;
  if (name === "phone") return <UltraIconPhone className="h-5 w-5" />;
  if (name === "email") return <UltraIconMail className="h-5 w-5" />;
  if (name === "schedule") return <UltraIconCalendar className="h-5 w-5" />;
  return <UltraIconMapPin className="h-5 w-5" />;
}

type Props = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function UltraContact({ content, dict, locale, defaultLocale }: Props) {
  const { contact, legal, social } = content;
  const whatsappHref = ultraContactChannels(content).whatsappHref;
  const channels = collectChannels(content, dict);
  const privacyHref = localizeSiteHref(
    legal.privacyNoticeUrl,
    locale,
    defaultLocale,
  );
  const preview = contact.formMode === "preview";

  return (
    <section id="contact" className="ultra-contact">
      <div className="ultra-shell ultra-contact__grid">
        <div className="ultra-contact__copy">
          <p className="ultra-eyebrow">{dict.contact.kicker}</p>
          <h2 className="ultra-section-title">{dict.contact.heading}</h2>
          <p className="ultra-lead">{dict.contact.description}</p>

          {channels.length > 0 ? (
            <ul className="ultra-channels">
              {channels.map((channel) => {
                const body = (
                  <>
                    <span className="ultra-channel__icon" aria-hidden>
                      <ChannelIcon name={channel.icon} />
                    </span>
                    <span className="ultra-channel__copy">
                      <span className="ultra-channel__eyebrow">
                        {channel.eyebrow}
                      </span>
                      <span className="ultra-channel__value">{channel.value}</span>
                    </span>
                    {channel.href ? (
                      <span className="ultra-channel__arrow" aria-hidden>
                        →
                      </span>
                    ) : null}
                  </>
                );
                return (
                  <li key={channel.key}>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="ultra-channel"
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
                      <p className="ultra-channel ultra-channel--static">{body}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="ultra-lead">{dict.contact.emptyChannels}</p>
          )}

          <UltraSocialLinks
            social={social}
            dict={dict}
            heading={dict.footer.follow}
            whatsappHref={whatsappHref}
            className="ultra-contact__social"
          />
        </div>

        <aside className="ultra-form-panel" aria-label={dict.contact.kicker}>
          <p className="ultra-form-panel__eyebrow">{dict.contact.formEyebrow}</p>
          <h3 className="ultra-form-panel__title">{dict.contact.formTitle}</h3>
          {preview ? (
            <form className="ultra-form-panel__preview" noValidate>
              <p className="ultra-lead">{dict.contact.formDescription}</p>
              <label className="ultra-form-field">
                {dict.contact.name}
                <input
                  name="name"
                  className="ultra-field"
                  autoComplete="name"
                  placeholder={dict.contact.namePlaceholder}
                  disabled
                />
              </label>
              <label className="ultra-form-field">
                {dict.contact.phone}
                <input
                  name="phone"
                  className="ultra-field"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={dict.contact.phonePlaceholder}
                  disabled
                />
              </label>
              <label className="ultra-form-consent">
                <input type="checkbox" name="privacyAccepted" disabled />
                <span>
                  {dict.contact.privacyConsent}{" "}
                  <a href={privacyHref} className="ultra-inline-link">
                    {dict.contact.privacyLink}
                  </a>
                </span>
              </label>
              <button type="submit" className="ultra-btn" disabled>
                {dict.contact.submit}
              </button>
              <p className="ultra-form-hint" role="status">
                {dict.contact.previewNote}
              </p>
            </form>
          ) : (
            <p className="ultra-lead">{dict.contact.formUnavailable}</p>
          )}
        </aside>
      </div>
    </section>
  );
}
