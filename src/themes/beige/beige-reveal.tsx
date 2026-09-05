import type { CSSProperties, ReactNode } from "react";

export type BeigeRevealVariant =
  | "up"
  | "left"
  | "right"
  | "zoom"
  | "fade"
  | "image";

type Props = {
  children: ReactNode;
  variant?: BeigeRevealVariant;
  delayMs?: number;
  className?: string;
};

export function BeigeReveal({
  children,
  variant = "up",
  delayMs = 0,
  className,
}: Props) {
  const style =
    delayMs > 0
      ? ({ "--beige-delay": `${delayMs}ms` } as CSSProperties)
      : undefined;

  return (
    <div
      data-beige-reveal={variant}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
}
