import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  variant?: "up" | "slow" | "left" | "zoom";
};

/**
 * Server-rendered reveal wrapper. The element is visible by default and only
 * animates once `OrangeMotionRoot` marks the theme root as motion-ready, so the
 * content stays readable without JavaScript.
 */
export function OrangeReveal({
  children,
  className,
  delayMs = 0,
  variant = "up",
}: Props) {
  const style = delayMs
    ? ({ "--orange-reveal-delay": `${delayMs}ms` } as CSSProperties)
    : undefined;

  return (
    <div
      data-orange-reveal={variant}
      style={style}
      className={["orange-reveal", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
