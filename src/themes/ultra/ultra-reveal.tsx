import type { CSSProperties, ReactNode } from "react";

export type UltraRevealVariant = "up" | "left" | "right" | "fade" | "zoom";

type Props = {
  children: ReactNode;
  variant?: UltraRevealVariant;
  delayMs?: number;
  durationMs?: number;
  className?: string;
};

export function UltraReveal({
  children,
  variant = "up",
  delayMs = 0,
  durationMs,
  className,
}: Props) {
  const style =
    delayMs > 0 || durationMs
      ? ({
          ...(delayMs > 0 ? { "--ultra-delay": `${delayMs}ms` } : {}),
          ...(durationMs ? { "--ultra-duration": `${durationMs}ms` } : {}),
        } as CSSProperties)
      : undefined;

  return (
    <div data-ultra-reveal={variant} style={style} className={className}>
      {children}
    </div>
  );
}
