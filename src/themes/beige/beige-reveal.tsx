import type { CSSProperties, ReactNode } from "react";

export type BeigeRevealVariant =
  | "up"
  | "left"
  | "right"
  | "left-zoom"
  | "zoom"
  | "fade"
  | "image";

type Props = {
  children: ReactNode;
  variant?: BeigeRevealVariant;
  delayMs?: number;
  durationMs?: number;
  className?: string;
};

export function BeigeReveal({
  children,
  variant = "up",
  delayMs = 0,
  durationMs,
  className,
}: Props) {
  const style =
    delayMs > 0 || durationMs
      ? ({
          ...(delayMs > 0 ? { "--beige-delay": `${delayMs}ms` } : {}),
          ...(durationMs ? { "--beige-duration": `${durationMs}ms` } : {}),
        } as CSSProperties)
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
