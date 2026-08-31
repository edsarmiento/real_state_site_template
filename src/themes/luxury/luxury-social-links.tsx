import type { PublicSocialLinks } from "@/lib/public-site-content";
import type { SiteDictionary } from "@/lib/site-i18n";
import {
  LuxuryIconFacebook,
  LuxuryIconInstagram,
} from "@/themes/luxury/luxury-icons";

type Props = {
  social: PublicSocialLinks;
  dict: SiteDictionary;
  heading?: string;
  surface?: "light" | "dark";
};

export function LuxurySocialLinks({
  social,
  dict,
  heading,
  surface = "light",
}: Props) {
  const items = [
    social.instagramUrl
      ? {
          key: "instagram" as const,
          href: social.instagramUrl,
          label: dict.social.instagram,
          icon: <LuxuryIconInstagram />,
        }
      : null,
    social.facebookUrl
      ? {
          key: "facebook" as const,
          href: social.facebookUrl,
          label: dict.social.facebook,
          icon: <LuxuryIconFacebook />,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item != null);

  if (items.length === 0) return null;

  return (
    <div
      className={
        surface === "dark"
          ? "luxury-social luxury-social--dark"
          : "luxury-social"
      }
    >
      {heading ? <p className="luxury-social__heading">{heading}</p> : null}
      <ul className="luxury-social__list" aria-label={dict.a11y.socialNav}>
        {items.map((item) => (
          <li key={item.key}>
            <a
              href={item.href}
              className="luxury-social__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              title={item.label}
            >
              <span aria-hidden>{item.icon}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
