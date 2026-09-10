import type { CSSProperties, ReactNode } from "react";

export type YellowRevealVariant =
  | "up"
  | "left"
  | "right"
  | "zoom"
  | "fade"
  | "clip";

type Props = {
  children: ReactNode;
  variant?: YellowRevealVariant;
  delayMs?: number;
  durationMs?: number;
  className?: string;
};

export function YellowReveal({
  children,
  variant = "up",
  delayMs = 0,
  durationMs,
  className,
}: Props) {
  const style =
    delayMs > 0 || durationMs
      ? ({
          ...(delayMs > 0 ? { "--yellow-delay": `${delayMs}ms` } : {}),
          ...(durationMs ? { "--yellow-duration": `${durationMs}ms` } : {}),
        } as CSSProperties)
      : undefined;

  return (
    <div data-yellow-reveal={variant} style={style} className={className}>
      {children}
    </div>
  );
}
