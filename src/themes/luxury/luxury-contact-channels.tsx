import type { PublicContactChannel } from "@/lib/public-contact-channels";
import type { SiteDictionary } from "@/lib/site-i18n";
import {
  LuxuryIconArrowRight,
  LuxuryIconCalendar,
  LuxuryIconEmail,
  LuxuryIconLocation,
  LuxuryIconPhone,
  LuxuryIconWhatsApp,
} from "@/themes/luxury/luxury-icons";

function ChannelIcon({ name }: { name: PublicContactChannel["icon"] }) {
  if (name === "whatsapp") return <LuxuryIconWhatsApp />;
  if (name === "phone") return <LuxuryIconPhone />;
  if (name === "email") return <LuxuryIconEmail />;
  if (name === "schedule") return <LuxuryIconCalendar />;
  return <LuxuryIconLocation />;
}

type Props = {
  channels: PublicContactChannel[];
  dict: SiteDictionary;
};

export function LuxuryContactChannels({ channels, dict }: Props) {
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
              <ChannelIcon name={channel.icon} />
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
                  channel.key === "whatsapp"
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