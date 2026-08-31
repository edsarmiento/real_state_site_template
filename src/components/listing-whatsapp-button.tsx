type Props = {
  phone: string;
  title: string;
  offerType?: "rent" | "sale";
  listingUrl: string;
  className?: string;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.77 14.06c-.24.68-1.42 1.28-1.97 1.36-.5.08-1.14.11-1.84-.12-.42-.13-.97-.32-1.67-.63-2.94-1.27-4.86-4.24-5.01-4.44-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.05-2.49.27-.3.6-.37.8-.37h.58c.19 0 .44-.01.68.52.24.55.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.45.53-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.3.15.47.13.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.68-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.34.08.13.08.74-.16 1.42z" />
    </svg>
  );
}

export function listingWhatsAppMessage(title: string, listingUrl: string): string {
  return `Hola, me interesaría saber más información respecto a la publicación «${title}».\n\n${listingUrl}`;
}

export function ListingWhatsAppButton({
  phone,
  title,
  listingUrl,
  offerType = "rent",
  className,
}: Props) {
  const digits = phone.replace(/\D/g, "");
  if (!/^\d{10}$/.test(digits)) return null;

  const href = `https://wa.me/52${digits}?text=${encodeURIComponent(listingWhatsAppMessage(title, listingUrl))}`;
  const label =
    offerType === "sale"
      ? "WhatsApp: me interesa comprar"
      : "WhatsApp: me interesa rentar";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "listing-whatsapp-button inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3.5 text-base font-semibold text-white transition hover:bg-[#1ebe57] sm:text-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0" />
      {label}
    </a>
  );
}
