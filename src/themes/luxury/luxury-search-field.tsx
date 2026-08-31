import type { ReactNode } from "react";

type Props = {
  label: string;
  htmlFor?: string;
  icon?: ReactNode;
  wide?: boolean;
  className?: string;
  children: ReactNode;
};

export function LuxurySearchField({
  label,
  htmlFor,
  icon,
  wide = false,
  className,
  children,
}: Props) {
  return (
    <div
      className={[
        "luxury-field luxury-finder__field",
        wide ? "luxury-finder__field--location" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label className="luxury-field__label luxury-finder__label" htmlFor={htmlFor}>
        {icon ? (
          <span className="luxury-finder__label-icon" aria-hidden>
            {icon}
          </span>
        ) : null}
        {label}
      </label>
      {children}
    </div>
  );
}