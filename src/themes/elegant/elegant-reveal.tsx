import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export function ElegantReveal({ children, className, delayMs = 0 }: Props) {
  const style = delayMs
    ? ({ "--elegant-reveal-delay": `${delayMs}ms` } as CSSProperties)
    : undefined;

  return (
    <div
      data-elegant-reveal="up"
      style={style}
      className={["elegant-reveal", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
