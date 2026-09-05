import type { PublicSocialLinks } from "@/lib/public-site-content";
import type { SiteDictionary } from "@/lib/site-i18n";
import {
  BeigeIconFacebook,
  BeigeIconInstagram,
} from "@/themes/beige/beige-icons";

type Props = {
  social: PublicSocialLinks;
  dict: SiteDictionary;
  heading?: string;
};

export function BeigeSocialLinks({ social, dict, heading }: Props) {
  const items = [
    social.instagramUrl
      ? {
          key: "instagram" as const,
          href: social.instagramUrl,
          label: dict.social.instagram,
          icon: BeigeIconInstagram,
        }
      : null,
    social.facebookUrl
      ? {
          key: "facebook" as const,
          href: social.facebookUrl,
          label: dict.social.facebook,
          icon: BeigeIconFacebook,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item != null);

  if (items.length === 0) return null;

  return (
    <div>
      {heading ? <p className="beige-footer__heading">{heading}</p> : null}
      <ul
        className="mt-4 flex flex-wrap items-center gap-3"
        aria-label={dict.a11y.socialNav}
      >
        {items.map((item) => (
          <li key={item.key}>
            <a
              href={item.href}
              className="beige-social-icon"
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
