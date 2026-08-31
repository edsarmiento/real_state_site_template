import type { ReactNode } from "react";
import { LuxuryIconWhatsApp } from "@/themes/luxury/luxury-icons";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export function LuxuryWhatsAppLink({
  href,
  children,
  className,
  onClick,
  ariaLabel,
}: Props) {
  return (
    <a
      href={href}
      className={["luxury-whatsapp-cta", className].filter(Boolean).join(" ")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <LuxuryIconWhatsApp />
      {children}
    </a>
  );
}