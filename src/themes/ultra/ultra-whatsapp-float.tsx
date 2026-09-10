import { UltraIconWhatsApp } from "@/themes/ultra/ultra-icons";

type Props = {
  href: string;
  label: string;
  opensInNewTab: string;
  raised?: boolean;
};

export function UltraWhatsAppFloat({
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
          ? "ultra-whatsapp-float ultra-whatsapp-float--raised"
          : "ultra-whatsapp-float"
      }
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}. ${opensInNewTab}`}
    >
      <UltraIconWhatsApp className="h-7 w-7" />
    </a>
  );
}
