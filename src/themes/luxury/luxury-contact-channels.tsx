import type { ContactContent } from "@/lib/public-site-content";
import type { SiteDictionary } from "@/lib/site-i18n";
import {
  LuxuryIconArrowRight,
  LuxuryIconCalendar,
  LuxuryIconEmail,
  LuxuryIconLocation,
  LuxuryIconPhone,
  LuxuryIconWhatsApp,
} from "@/themes/luxury/luxury-icons";

type Channel = {
  key: string;
  eyebrow: string;
  value: string;
  href: string | null;
  external?: boolean;
  whatsapp?: boolean;
};

function collectChannels(
  contact: ContactContent,
  dict: SiteDictionary,
): Channel[] {
  const channels: Channel[] = [];
  if (contact.whatsappHref) {
    channels.push({
      key: "whatsapp",
      eyebrow: dict.contact.writeUs,
      value: dict.whatsapp.label,
      href: contact.whatsappHref,
      external: true,
      whatsapp: true,
    });
  }
  if (contact.phoneHref) {
    channels.push({
      key: "phone",
      eyebrow: dict.contact.callUs,
      value: contact.phone || dict.contact.callUs,
      href: contact.phoneHref,
    });
  }
  if (contact.emailHref && contact.email) {
    channels.push({
      key: "email",
      eyebrow: dict.contact.email,
      value: contact.email,
      href: contact.emailHref,
    });
  }
  if (contact.scheduleCallUrl) {
    channels.push({
      key: "schedule",
      eyebrow: dict.contact.schedule,
      value: dict.contact.scheduleValue,
      href: contact.scheduleCallUrl,
      external: true,
    });
  }
  if (contact.location) {
    channels.push({
      key: "location",
      eyebrow: dict.contact.location,
      value: contact.location,
      href: null,
    });
  }
  return channels;
}

function ChannelIcon({ name }: { name: string }) {
  if (name === "whatsapp") return <LuxuryIconWhatsApp />;
  if (name === "phone") return <LuxuryIconPhone />;
  if (name === "email") return <LuxuryIconEmail />;
  if (name === "schedule") return <LuxuryIconCalendar />;
  return <LuxuryIconLocation />;
}

export function hasContactChannels(contact: ContactContent): boolean {
  return Boolean(
    contact.whatsappHref ||
      contact.phoneHref ||
      (contact.emailHref && contact.email) ||
      contact.scheduleCallUrl ||
      contact.location,
  );
}

type Props = {
  contact: ContactContent;
  dict: SiteDictionary;
};

export function LuxuryContactChannels({ contact, dict }: Props) {
  const channels = collectChannels(contact, dict);
  if (channels.length === 0) return null;

  return (
    <ul
      className={
        channels.length === 1
          ? "luxury-channels luxury-channels--single"
          : "luxury-channels"
      }
    >
      {channels.map((channel) => {
        const body = (
          <>
            <span className="luxury-channel__icon" aria-hidden>
              <ChannelIcon name={channel.key} />
            </span>
            <span className="luxury-channel__copy">
              <span className="luxury-channel__eyebrow">{channel.eyebrow}</span>
              <span className="luxury-channel__value">{channel.value}</span>
            </span>
            {channel.href ? (
              <LuxuryIconArrowRight className="luxury-channel__arrow" />
            ) : null}
          </>
        );

        return (
          <li key={channel.key}>
            {channel.href ? (
              <a
                href={channel.href}
                className={
                  channel.whatsapp
                    ? "luxury-channel luxury-channel--whatsapp"
                    : "luxury-channel"
                }
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
              <p className="luxury-channel luxury-channel--static">{body}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}