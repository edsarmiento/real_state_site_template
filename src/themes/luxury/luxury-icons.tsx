import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function Icon({
  className = "luxury-icon",
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function LuxuryIconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M16.2 16.2 20 20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function LuxuryIconLocation(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="11" r="1.7" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}

export function LuxuryIconHome(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4.5 11.2 12 5l7.5 6.2V19a1.4 1.4 0 0 1-1.4 1.4H5.9A1.4 1.4 0 0 1 4.5 19v-7.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 20.4V14h4v6.4" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}

export function LuxuryIconBedrooms(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4 17.5V10.5A1.5 1.5 0 0 1 5.5 9h13A1.5 1.5 0 0 1 20 10.5v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M4 13.5h16M7 9V7.8A1.8 1.8 0 0 1 8.8 6h6.4A1.8 1.8 0 0 1 17 7.8V9"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </Icon>
  );
}

export function LuxuryIconPhone(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M8.2 4.8h2.3l1 3-1.7 1.1a11 11 0 0 0 5.3 5.3l1.1-1.7 3 1v2.3a1.8 1.8 0 0 1-2 1.8A13.4 13.4 0 0 1 6.4 6.8a1.8 1.8 0 0 1 1.8-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function LuxuryIconEmail(props: IconProps) {
  return (
    <Icon {...props}>
      <rect
        x="4"
        y="6.5"
        width="16"
        height="11"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 8l7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function LuxuryIconWhatsApp(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M5.2 18.4 5.8 15.8A7.6 7.6 0 1 1 8 19.1l-2.8.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 10.2c.2 1.8 2 3.6 3.8 3.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function LuxuryIconCalendar(props: IconProps) {
  return (
    <Icon {...props}>
      <rect
        x="4"
        y="6"
        width="16"
        height="14"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 10h16M8 4v4M16 4v4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </Icon>
  );
}

export function LuxuryIconArrowLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M18 12H6M11 7l-5 5 5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function LuxuryIconArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M6 12h12M13 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function LuxuryIconChevronDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M6 9.5 12 15.5 18 9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function LuxuryIconBath(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M5 12.5h14v3.2A2.8 2.8 0 0 1 16.2 18.5H7.8A2.8 2.8 0 0 1 5 15.7v-3.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7 12.5V8.4A2.4 2.4 0 0 1 9.4 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function LuxuryIconInstagram(props: IconProps) {
  return (
    <Icon {...props}>
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.4" cy="7.6" r="0.9" fill="currentColor" />
    </Icon>
  );
}

export function LuxuryIconFacebook(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M14.2 8.2h1.8V5.4h-1.8c-2.2 0-3.6 1.5-3.6 3.7v1.6H9v2.8h1.6V19h3.1v-5.5h2.1l.4-2.8h-2.5V9.2c0-.6.3-1 .9-1Z"
        fill="currentColor"
      />
    </Icon>
  );
}

export function LuxuryIconArea(props: IconProps) {
  return (
    <Icon {...props}>
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="1.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M5 10h14M10 5v14" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}

export function LuxuryIconQuote(props: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={props.className ?? "luxury-icon"}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8.4 23c2.1 0 3.7-1.6 3.7-3.8 0-2-1.4-3.5-3.3-3.5-.3-1.9 1.1-3.9 3.4-5.1L10.6 8.4C7.2 10.1 4.8 13.3 4.8 17.4 4.8 20.6 6.5 23 8.4 23Zm11.2 0c2.1 0 3.7-1.6 3.7-3.8 0-2-1.4-3.5-3.3-3.5-.3-1.9 1.1-3.9 3.4-5.1l-1.6-2.2c-3.4 1.7-5.8 4.9-5.8 9 0 3.2 1.7 5.6 3.6 5.6Z"
        fill="currentColor"
      />
    </svg>
  );
}
