import type { PublicSocialLinks } from "@/lib/public-site-content";
import type { SiteDictionary } from "@/lib/site-i18n";
import {
  ElegantIconFacebook,
  ElegantIconInstagram,
} from "@/themes/elegant/elegant-icons";

type Props = {
  social: PublicSocialLinks;
  dict: SiteDictionary;
  heading?: string;
  accentHeading?: boolean;
};

export function ElegantSocialLinks({
  social,
  dict,
  heading,
  accentHeading = false,
}: Props) {
  const items = [
    social.instagramUrl
      ? {
          key: "instagram" as const,
          href: social.instagramUrl,
          label: dict.social.instagram,
          icon: ElegantIconInstagram,
        }
      : null,
    social.facebookUrl
      ? {
          key: "facebook" as const,
          href: social.facebookUrl,
          label: dict.social.facebook,
          icon: ElegantIconFacebook,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item != null);

  if (items.length === 0) return null;

  return (
    <div>
      {heading ? (
        <p
          className={
            accentHeading
              ? "elegant-footer__heading elegant-footer__heading--accent"
              : "elegant-footer__heading"
          }
        >
          {heading}
        </p>
      ) : null}
      <ul className="elegant-social" aria-label={dict.a11y.socialNav}>
        {items.map((item) => (
          <li key={item.key}>
            <a
              href={item.href}
              className="elegant-social__link"
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
