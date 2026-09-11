import type { CSSProperties, ReactNode } from "react";

export type DarkRevealVariant = "up" | "left" | "right" | "zoom" | "fade";

type Props = {
  children: ReactNode;
  variant?: DarkRevealVariant;
  delayMs?: number;
  durationMs?: number;
  className?: string;
};

export function DarkReveal({
  children,
  variant = "up",
  delayMs = 0,
  durationMs,
  className,
}: Props) {
  const style =
    delayMs > 0 || durationMs
      ? ({
          ...(delayMs > 0 ? { "--dark-delay": `${delayMs}ms` } : {}),
          ...(durationMs ? { "--dark-duration": `${durationMs}ms` } : {}),
        } as CSSProperties)
      : undefined;

  return (
    <div data-dark-reveal={variant} style={style} className={className}>
      {children}
    </div>
  );
}
