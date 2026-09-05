import {
  buildWhatsAppHref,
  parseWhatsAppNumber,
} from "@/lib/public-site-content";
import { listingPublicUrl } from "@/lib/site-config-env";
import { fillTemplate, type SiteDictionary } from "@/lib/site-i18n";
import { BeigeIconWhatsApp } from "@/themes/beige/beige-icons";

type Props = {
  phone: string;
  title: string;
  slug: string;
  offerType?: "rent" | "sale";
  dict: SiteDictionary;
  className?: string;
  label?: string;
};

export function BeigeListingWhatsAppButton({
  phone,
  title,
  slug,
  offerType = "rent",
  dict,
  className,
  label,
}: Props) {
  const number = parseWhatsAppNumber(phone);
  if (!number) return null;

  const url = listingPublicUrl(slug);
  const href = buildWhatsAppHref(
    number,
    fillTemplate(dict.inquiry.whatsappMessage, { title, url }),
  );
  const text =
    label ??
    (offerType === "sale"
      ? dict.inquiry.whatsappSale
      : dict.inquiry.whatsappRent);

  return (
    <a
      href={href}
      className={className ?? "beige-btn beige-detail__whatsapp"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${text}. ${dict.a11y.opensInNewTab}`}
    >
      <BeigeIconWhatsApp className="h-5 w-5" />
      {text}
    </a>
  );
}
