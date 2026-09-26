import {
  collectPublicContactChannels,
  type PublicContactChannel,
} from "@/lib/public-contact-channels";
import type { PublicSiteContent } from "@/lib/public-site-content";
import type { SiteDictionary } from "@/lib/site-i18n";
import { ultraContactChannels } from "@/themes/ultra/ultra-contact-channels";
import {
  UltraIconCalendar,
  UltraIconMail,
  UltraIconMapPin,
  UltraIconPhone,
  UltraIconWhatsApp,
} from "@/themes/ultra/ultra-icons";
import { UltraReveal } from "@/themes/ultra/ultra-reveal";
import { UltraSocialLinks } from "@/themes/ultra/ultra-social-links";

function ChannelIcon({ name }: { name: PublicContactChannel["icon"] }) {
  if (name === "whatsapp") return <UltraIconWhatsApp className="h-5 w-5" />;
  if (name === "phone") return <UltraIconPhone className="h-5 w-5" />;
  if (name === "email") return <UltraIconMail className="h-5 w-5" />;
  if (name === "schedule") return <UltraIconCalendar className="h-5 w-5" />;
  return <UltraIconMapPin className="h-5 w-5" />;
}

type Props = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  description: string;
};

export function UltraContact({ content, dict, description }: Props) {
  const { social } = content;
  const whatsappHref = ultraContactChannels(content).whatsappHref;
  const channels = collectPublicContactChannels(content, dict);
  const title = content.finalCta.title || dict.finalCta.title;

  return (
    <section
      id="contact"
      className="ultra-contact"
      aria-labelledby="ultra-contact-title"
    >
      <div className="ultra-shell">
        <div className="ultra-contact__panel">
          <UltraReveal variant="up" className="ultra-contact__header">
            <p className="ultra-eyebrow">{dict.contact.kicker}</p>
            <h2 id="ultra-contact-title" className="ultra-section-title">
              {dict.contact.heading}
            </h2>
            <p className="ultra-lead">{dict.contact.description}</p>
          </UltraReveal>
          <div className="ultra-contact__grid">
            <UltraReveal variant="left">
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
            </UltraReveal>

            <UltraReveal variant="right" delayMs={80}>
              <div className="ultra-contact__cta">
                <h3 className="ultra-section-title">{title}</h3>
                <p className="ultra-lead">{description}</p>
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    className="ultra-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
                  >
                    <UltraIconWhatsApp className="h-5 w-5" aria-hidden />
                    {dict.whatsapp.label}
                  </a>
                ) : null}
              </div>
            </UltraReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
