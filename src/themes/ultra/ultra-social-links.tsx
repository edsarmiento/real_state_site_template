import type { PublicSocialLinks } from "@/lib/public-site-content";
import type { SiteDictionary } from "@/lib/site-i18n";
import {
  UltraIconFacebook,
  UltraIconInstagram,
  UltraIconWhatsApp,
} from "@/themes/ultra/ultra-icons";

type Props = {
  social: PublicSocialLinks;
  dict: SiteDictionary;
  heading?: string;
  whatsappHref?: string | null;
  className?: string;
};

export function UltraSocialLinks({
  social,
  dict,
  heading,
  whatsappHref,
  className,
}: Props) {
  const items = [
    social.instagramUrl
      ? {
          key: "instagram" as const,
          href: social.instagramUrl,
          label: dict.social.instagram,
          icon: UltraIconInstagram,
        }
      : null,
    social.facebookUrl
      ? {
          key: "facebook" as const,
          href: social.facebookUrl,
          label: dict.social.facebook,
          icon: UltraIconFacebook,
        }
      : null,
    whatsappHref
      ? {
          key: "whatsapp" as const,
          href: whatsappHref,
          label: dict.whatsapp.label,
          icon: UltraIconWhatsApp,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item != null);

  if (items.length === 0) return null;

  return (
    <div className={className}>
      {heading ? <p className="ultra-footer__heading">{heading}</p> : null}
      <ul className="ultra-social" aria-label={dict.a11y.socialNav}>
        {items.map((item) => (
          <li key={item.key}>
            <a
              href={item.href}
              className="ultra-social-icon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.label}. ${dict.a11y.opensInNewTab}`}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
