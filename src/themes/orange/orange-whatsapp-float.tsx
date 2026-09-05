type Props = {
  href: string;
  label: string;
  opensInNewTab: string;
  raised?: boolean;
};

export function OrangeWhatsAppFloat({
  href,
  label,
  opensInNewTab,
  raised = false,
}: Props) {
  return (
    <a
      href={href}
      className={raised ? "orange-wa-float orange-wa-float--raised" : "orange-wa-float"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}. ${opensInNewTab}`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="currentColor">
        <path d="M12 3.2A8.8 8.8 0 0 0 4.4 16.6L3.2 21l4.5-.8A8.8 8.8 0 1 0 12 3.2zm5.1 12.4c-.2.6-1.2 1.1-1.9 1.2-.5.1-1.1.2-3.5-.8-3-1.2-4.9-4.2-5-4.4-.2-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4c.2-.2.5-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2 0 .4-.1.6l-.4.5c-.1.2-.3.4 0 .8.6 1 1.5 1.9 2.5 2.5.4.2.6.2.8 0l.6-.6c.2-.2.4-.1.6 0l1.8 1c.3.1.4.3.4.5v.8z" />
      </svg>
    </a>
  );
}
