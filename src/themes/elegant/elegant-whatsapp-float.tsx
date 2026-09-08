import { ElegantIconWhatsApp } from "@/themes/elegant/elegant-icons";

type Props = {
  href: string;
  label: string;
  opensInNewTab: string;
  raised?: boolean;
};

export function ElegantWhatsAppFloat({
  href,
  label,
  opensInNewTab,
  raised = false,
}: Props) {
  return (
    <a
      href={href}
      className={
        raised
          ? "elegant-whatsapp-float elegant-whatsapp-float--raised"
          : "elegant-whatsapp-float"
      }
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}. ${opensInNewTab}`}
    >
      <ElegantIconWhatsApp className="h-6 w-6" />
    </a>
  );
}
