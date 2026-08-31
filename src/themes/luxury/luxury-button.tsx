import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

export type LuxuryButtonVariant =
  | "gold"
  | "navy"
  | "outline"
  | "ghost"
  | "neutral"
  | "whatsapp";

export type LuxuryButtonSize = "md" | "sm";
export type LuxuryButtonSurface = "light" | "dark";

type Props = {
  variant?: LuxuryButtonVariant;
  size?: LuxuryButtonSize;
  surface?: LuxuryButtonSurface;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  name?: string;
  value?: string;
  "aria-label"?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function buttonClassName({
  variant,
  size,
  surface,
  fullWidth,
  loading,
  className,
}: {
  variant: LuxuryButtonVariant;
  size: LuxuryButtonSize;
  surface: LuxuryButtonSurface;
  fullWidth: boolean;
  loading: boolean;
  className?: string;
}): string {
  return [
    "luxury-button",
    `luxury-button--${variant}`,
    `luxury-button--${size}`,
    surface === "dark" ? "luxury-button--on-dark" : null,
    fullWidth ? "luxury-button--block" : null,
    loading ? "luxury-button--loading" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function LuxuryButton({
  variant = "gold",
  size = "md",
  surface = "light",
  href,
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  iconStart,
  iconEnd,
  className,
  target,
  rel,
  name,
  value,
  children,
  onClick,
  "aria-label": ariaLabel,
}: Props) {
  const classNames = buttonClassName({
    variant,
    size,
    surface,
    fullWidth,
    loading,
    className,
  });
  const content = (
    <>
      {iconStart ? (
        <span className="luxury-button__icon" aria-hidden>
          {iconStart}
        </span>
      ) : null}
      <span className="luxury-button__label">{children}</span>
      {iconEnd ? (
        <span className="luxury-button__icon" aria-hidden>
          {iconEnd}
        </span>
      ) : null}
    </>
  );

  if (href) {
    const externalRel =
      rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);
    const shared = {
      className: classNames,
      "aria-label": ariaLabel,
      "aria-busy": loading || undefined,
      "aria-disabled": disabled || loading || undefined,
      onClick,
    };

    if (disabled || loading) {
      return (
        <span {...shared} role="link">
          {content}
        </span>
      );
    }

    if (isInternalHref(href)) {
      return (
        <Link href={href} {...shared}>
          {content}
        </Link>
      );
    }

    return (
      <a href={href} target={target} rel={externalRel} {...shared}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      name={name}
      value={value}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
