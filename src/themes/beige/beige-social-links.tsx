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
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#FBF9F5]">
          {heading}
        </p>
      ) : null}
      <ul className="flex gap-3" aria-label={dict.a11y.socialNav}>
        {items.map((item) => (
          <li key={item.key}>
            <a
              href={item.href}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D9C5]/30 text-[#FBF9F5] transition-colors hover:border-[#C4D3A2] hover:text-[#C4D3A2]"
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
