import { useId } from "react";

export type LuxuryIntentOption = {
  id: string;
  label: string;
  value: string;
};

type Props = {
  name: string;
  legend: string;
  label: string;
  options: LuxuryIntentOption[];
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
};

export function LuxuryIntentSwitch({
  name,
  legend,
  label,
  options,
  defaultValue,
  disabled = false,
  className,
}: Props) {
  const autoId = useId();

  return (
    <div
      className={["luxury-field", className].filter(Boolean).join(" ")}
    >
      <span className="luxury-field__label luxury-finder__label" aria-hidden>
        {label}
      </span>
      <fieldset
        className={
          disabled
            ? "luxury-fieldset luxury-intent luxury-intent--disabled"
            : "luxury-fieldset luxury-intent"
        }
        disabled={disabled}
      >
        <legend className="sr-only luxury-sr-only">{legend}</legend>
        <div className="luxury-intent__track">
          {options.map((option) => {
            const inputId = `${autoId}-${option.id}`;
            return (
              <div key={option.id} className="luxury-intent__item">
                <input
                  id={inputId}
                  className="luxury-intent__input"
                  type="radio"
                  name={name}
                  value={option.value}
                  defaultChecked={
                    defaultValue != null
                      ? defaultValue === option.value || defaultValue === option.id
                      : undefined
                  }
                  disabled={disabled}
                />
                <label htmlFor={inputId} className="luxury-intent__option">
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}