import { BeigeIconWhatsApp } from "@/themes/beige/beige-icons";

type Props = {
  href: string;
  label: string;
  opensInNewTab: string;
  raised?: boolean;
};

export function BeigeWhatsAppFloat({
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
          ? "beige-whatsapp-float beige-whatsapp-float--raised group"
          : "beige-whatsapp-float group"
      }
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}. ${opensInNewTab}`}
    >
      <span
        className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-[#2D2A26] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 sm:inline-block"
        aria-hidden
      >
        {label}
      </span>
      <BeigeIconWhatsApp className="h-7 w-7" />
    </a>
  );
}
