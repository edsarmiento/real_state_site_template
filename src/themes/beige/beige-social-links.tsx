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
    social.facebookUrl
      ? {
          key: "facebook" as const,
          href: social.facebookUrl,
          label: dict.social.facebook,
          icon: BeigeIconFacebook,
        }
      : null,
    social.instagramUrl
      ? {
          key: "instagram" as const,
          href: social.instagramUrl,
          label: dict.social.instagram,
          icon: BeigeIconInstagram,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item != null);

  if (items.length === 0) return null;

  return (
    <div data-beige-social>
      {heading ? (
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5]">
          {heading}
        </p>
      ) : null}
      <ul className="space-y-3 text-[0.9375rem]" aria-label={dict.a11y.socialNav}>
        {items.map((item) => (
          <li key={item.key}>
            <a
              href={item.href}
              className="beige-social-link inline-flex items-center gap-2.5 text-[#E5D9C5] transition-colors hover:text-[#C4D3A2] focus-visible:text-[#C4D3A2]"
              target="_blank"
              rel="noopener noreferrer"
              data-beige-social={item.key}
              aria-label={`${item.label}. ${dict.a11y.opensInNewTab}`}
              title={item.label}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#A4B494]/40 text-[#E5D9C5]">
                <item.icon className="h-4 w-4" />
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
