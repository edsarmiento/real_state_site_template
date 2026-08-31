import { LuxuryIconWhatsApp } from "@/themes/luxury/luxury-icons";

type Props = {
  href: string;
  label: string;
  opensInNewTab: string;
  raised?: boolean;
};

export function LuxuryWhatsAppFloat({
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
          ? "luxury-whatsapp-float luxury-whatsapp-float--raised"
          : "luxury-whatsapp-float"
      }
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}. ${opensInNewTab}`}
    >
      <span className="luxury-whatsapp-float__tooltip">{label}</span>
      <span className="luxury-whatsapp-float__icon" aria-hidden>
        <LuxuryIconWhatsApp />
      </span>
    </a>
  );
}

export function LuxuryWhatsAppFloatingButton(props: Props) {
  return <LuxuryWhatsAppFloat {...props} />;
}