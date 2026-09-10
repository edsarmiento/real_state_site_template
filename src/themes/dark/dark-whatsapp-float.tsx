import { DarkIconWhatsApp } from "@/themes/dark/dark-icons";

type Props = {
  href: string;
  label: string;
  opensInNewTab: string;
  raised?: boolean;
};

export function DarkWhatsAppFloat({
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
          ? "dark-whatsapp-float dark-whatsapp-float--raised"
          : "dark-whatsapp-float"
      }
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}. ${opensInNewTab}`}
    >
      <DarkIconWhatsApp className="h-7 w-7" />
    </a>
  );
}
