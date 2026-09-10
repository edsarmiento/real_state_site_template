import type { PublicSocialLinks } from "@/lib/public-site-content";
import type { SiteDictionary } from "@/lib/site-i18n";
import {
  ExecutiveIconFacebook,
  ExecutiveIconInstagram,
} from "@/themes/executive/executive-icons";

type Props = {
  social: PublicSocialLinks;
  dict: SiteDictionary;
  heading?: string;
};

export function ExecutiveSocialLinks({ social, dict, heading }: Props) {
  const items = [
    social.instagramUrl
      ? {
          key: "instagram" as const,
          href: social.instagramUrl,
          label: dict.social.instagram,
          icon: ExecutiveIconInstagram,
        }
      : null,
    social.facebookUrl
      ? {
          key: "facebook" as const,
          href: social.facebookUrl,
          label: dict.social.facebook,
          icon: ExecutiveIconFacebook,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item != null);

  if (items.length === 0) return null;

  return (
    <div className="executive-social">
      {heading ? <p className="executive-footer__heading">{heading}</p> : null}
      <ul className="executive-social__list" aria-label={dict.a11y.socialNav}>
        {items.map((item) => (
          <li key={item.key}>
            <a
              href={item.href}
              className="executive-social__icon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.label}. ${dict.a11y.opensInNewTab}`}
              title={item.label}
            >
              <item.icon className="h-4 w-4" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
