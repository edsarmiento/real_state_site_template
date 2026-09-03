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
      {heading ? (
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5]">
          {heading}
        </p>
      ) : null}
      <ul className="flex gap-4" aria-label={dict.a11y.socialNav}>
        {items.map((item) => (
          <li key={item.key}>
            <a
              href={item.href}
              className="beige-social-icon inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#A4B494]/40 text-[#E5D9C5] transition-all duration-300 hover:border-[#A4B494] hover:bg-[#A4B494] hover:text-[#2D2A26] hover:shadow-lg hover:shadow-[#A4B494]/20 focus-visible:border-[#A4B494] focus-visible:bg-[#A4B494] focus-visible:text-[#2D2A26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A4B494] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D2A26]"
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
