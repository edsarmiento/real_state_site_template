import type { ReactNode } from "react";

type IconProps = { className?: string };

function Icon({ className = "h-5 w-5", children }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      {children}
    </svg>
  );
}

export function OrangeIconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.2 16.2 20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Icon>
  );
}

export function OrangeIconMenu(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Icon>
  );
}

export function OrangeIconClose(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Icon>
  );
}

export function OrangeIconWhatsApp(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L4 21l4.8-.7A8.5 8.5 0 1 0 12 3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.2 8.8c.2-.4.5-.4.7-.4h.6c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.2.6l-.5.5c.7 1.3 1.8 2.3 3.1 3l.5-.4c.2-.2.5-.2.6 0l1.5.8c.3.1.4.3.4.5v.6c0 .2 0 .5-.4.7-1 .6-2.8.8-5.3-1.4-2.2-2-2.6-3.8-2.2-5.1z"
        fill="currentColor"
      />
    </Icon>
  );
}

export function OrangeIconPhone(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.1 4.5 9.3 8 7.8 9.5c1.4 2.8 3.9 5.2 6.7 6.7l1.5-1.5 3.5 2.2c.3.2.4.5.3.9l-.7 2.1c-.1.4-.5.6-.9.6C10.1 20 4 13.9 3.5 5.8c0-.4.2-.8.6-.9l2.1-.7c.4-.1.7 0 .9.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function OrangeIconArrowLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function OrangeIconArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function OrangeIconShare(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="18" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="19" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12.8 16 18.2M16 5.8 8 11.2" stroke="currentColor" strokeWidth="1.5" />
    </Icon>
  );
}

export function OrangeIconHome(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-5v-5H10v5H5a1 1 0 0 1-1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </Icon>
  );
}

export function OrangeIconBed(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 18V9.5A1.5 1.5 0 0 1 5.5 8H10a3 3 0 0 1 4 0h4.5A1.5 1.5 0 0 1 20 9.5V18M4 14h16M7 18v2M17 18v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  );
}

export function OrangeIconBath(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14v2.5A4.5 4.5 0 0 1 14.5 19h-5A4.5 4.5 0 0 1 5 14.5zM7 12V8.5A2.5 2.5 0 0 1 9.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  );
}

export function OrangeIconMaximize(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  );
}

export function OrangeIconLocation(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    </Icon>
  );
}

export function OrangeIconStar(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.8 6.2 18.4l.9-5.4L3.2 9.2l5.4-.8z"
        fill="currentColor"
      />
    </Icon>
  );
}

export function OrangeIconListing(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 5h14v14H5z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  );
}

export function OrangeIconChat(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 6h14v10H9l-4 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </Icon>
  );
}

export function OrangeIconGlobe(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.8 12h16.4M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5M12 3.5C9.8 5.8 8.7 8.6 8.7 12s1.1 6.2 3.3 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  );
}

export function OrangeIconFacebook(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13.7 20v-7h2.4l.4-2.8h-2.8V8.4c0-.8.2-1.4 1.4-1.4h1.5V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8.6V13h2.5v7h2.6Z" fill="currentColor" />
    </Icon>
  );
}

export function OrangeIconInstagram(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.3" cy="6.8" r="1" fill="currentColor" />
    </Icon>
  );
}

export function OrangeIconCheckCircle(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="m8.5 12 2.4 2.4 4.6-4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function OrangeIconCatalog(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 4h12v16H6z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  );
}
